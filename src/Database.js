import { emitter } from './EventBus'

import { FileSystemDriver } from "./FileSystemDriver"

export class Database {
    static aReposList = [
        /**
         * { "login": "", "repo": "", "key": "", type: "", url: "" }
         */
    ]

    static iSelectedRepo = null
    static sSelectedArticleID = null
    static iSelectedCategory = null
    static iSelectedGroup = null
    static iSelectedTag = null
    static iSelectedLink = null

    static get oDatabase() {
        return FileSystemDriver.oDatabase
    }

    static {
        // Database.oDatabase = Database.oDefaultDatabase
    }

    static sFilePath = ''
    
    // ===============================================================

    static fnLoadReposList()
    {
        _s('fnLoadReposList')
        var sRepos = localStorage.getItem('repos') || "[]"
        Database.aReposList = JSON.parse(sRepos)

        emitter.emit('database-repos-loaded', {
            aList: Database.aReposList,
            iSelectedRepoIndex: Database.iSelectedRepo
        })
    }

    static fnUpdateRepo(iRepoIndex, oItem)
    {
        // Database.aReposList = Database.aReposList || []
        _l(">>", {aArgs:arguments})
        if (iRepoIndex==-1) {
            Database.aReposList.push(oItem)
        } else {
            Database.aReposList.splice(iRepoIndex, 1, oItem)
        }
        emitter.emit('database-repos-save')
    }

    static fnRemoveRepo(iRepoIndex)
    {
        Database.aReposList.splice(iRepoIndex, 1)
        emitter.emit('database-repos-save')
    }

    static fnCleanRepo()
    {
        Database.aReposList = []
        emitter.emit('database-repos-save')
    }

    static fnAddRepo(oRepo)
    {
        Database.aReposList.push(oRepo)
        emitter.emit('database-repos-save')
    }

    static fnSelectRepo(iRepoIndex)
    {
        if (Database.aReposList[iRepoIndex]) {
            Database.iSelectedRepo = iRepoIndex
            _l('fnSelectRepo')

            FileSystemDriver.fnInit(Database.aReposList[iRepoIndex])

            emitter.emit('database-repos-selected')
            emitter.emit('database-repos-save')

            // NOTE: Переписать сделать после подгрузки репозитория
            // Выбор -> Проверка (читаем базу) -> Обновляем список
        } else {
            emitter.emit('database-repos-select-error')
        }
    }

    static fnGetSelectRepo()
    {
        emitter.emit('database-repos-selected-info', {
            iIndex: Database.iSelectedRepo,
            oRepo: Database.aReposList[Database.iSelectedRepo]
        })
    }

    static fnSaveReposList()
    {
        localStorage.setItem('repos', JSON.stringify(Database.aReposList))

        emitter.emit('database-repos-saved')
    }

    // ===============================================================

    // NOTE: Database методы
    static fnGetByID(sTable, sRecordID)
    {
        var aR = Database.oDatabase[sTable].filter((oI) => oI.id == sRecordID)
        if (aR.length) {
            return aR[0]
        }
        return null
    }

    static fnUpdateRecord(sTable, sRecordID, oData)
    {
        var aR = Database.oDatabase[sTable].filter((oI) => oI.id == sRecordID)
        if (aR.length) {
            $.extend(aR[0], oData)
            _l(aR[0], Database.oDatabase[sTable]);
        }
    }

    static fnAddRecord(sTable, oData)
    {
        var sLastID = Database.oDatabase[sTable+"_last_id"]*1 + 1
        Database.oDatabase[sTable].push({
            "id": sLastID,
            ...oData
        })
        Database.oDatabase[sTable+"_last_id"] = sLastID
        return sLastID
    }

    static fnUpdateFilename(sArticleID)
    {
        var aArticles = Database.fnFilterArticlesByID(sArticleID)
        if (aArticles.length) {
            var sID = aArticles[0].id
            Database.sFilePath = Database.fnGetArticlePath(sID)
        }
    }

    // ===============================================================

    // ===============================================================

    static fnRepoSelected()
    {
        Database
            .fnReadDatabase()
            .then(() => {
                emitter.emit('database-repos-load')
            })
    }

    static fnReadDatabase()
    {
        _l('fnReadDatabase', [Database.oDatabase])
        return FileSystemDriver
            .fnReadFileJSON(Database.oDatabase)
            // .then((oDatabase) => {
            //     Database.oDatabase = oDatabase
            //     _l('fnReadDatabase then', [Database.oDatabase])
            // })
    }

    static fnWriteDatabase()
    {
        _l('fnWriteDatabase', [Database.oDatabase])
        FileSystemDriver
            .fnWriteDatabase()
    }

    // ===============================================================

    static fnParseAPIInfo()
    {
        // bootstrap его использует
        var aHash, sHash;

        try {
            sHash = location.hash.split('#')[1]
            aHash = sHash.split(':')
        } catch (_) {
            aHash = ['', '', '']
        }

        Database.sLogin = aHash[0]
        Database.sRepo = aHash[1]
        Database.sAPIKey = aHash[2]
    }

    // ===============================================================

    static fnSelectArticle(sID)
    {
        Database.sSelectedArticleID = sID
        var oArticle = null 
        var oCategory = null
        var oGroup = null
        if (sID) {
            oArticle = Database.fnGetCurrentArticle()
            if (oArticle.category_id) {
                oCategory = Database.fnGetArticleCategory(oArticle.category_id)
                if (oCategory.group_id) {
                    oGroup = Database.fnGetArticleGroup(oCategory.group_id)
                }
            }
        }

        _l('>>>', [oArticle, oCategory, oGroup])
        emitter.emit('database-catalog-article-selected', 
            Database.sSelectedArticleID, 
            oArticle,
            oCategory,
            oGroup
        )
    }

    static fnGetArticlesList()
    {
        _l('fnGetArticlesList')
        emitter.emit('database-article-list-loaded', { 
            aList: Database.oDatabase.articles, 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnFilterArticlesList(sFilter)
    {
        emitter.emit('database-article-list-filter-loaded', { 
            aList: Database.fnFilterArticles(sFilter), 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnFilterCatalogArticlesList(sFilter)
    {
        emitter.emit('database-catalog-article-list-filter-loaded', { 
            aList: Database.fnFilterCurrentArticles(sFilter), 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnFilterTagArticlesList(sFilter)
    {
        emitter.emit('database-tag-article-list-filter-loaded', { 
            aList: Database.fnFilterCurrentTagsArticles(sFilter), 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnUpdateArticle(oItem)
    {
        var oNewItem = {...oItem}
        var iI = Database.oDatabase.articles.findIndex((oI) => oNewItem.id == oI.id)
        Database.oDatabase.articles.splice(iI, 1, oNewItem)
        _l('>>> fnUpdateArticle', [Database.oDatabase.articles, oNewItem])
        emitter.emit('database-article-saved')
    }

    static fnRemoveArticle(sID)
    {
        var iI = Database.oDatabase.articles.findIndex((oI) => sID == oI.id)
        Database.oDatabase.articles.splice(iI, 1)
        emitter.emit('database-article-removed')
    }

    static fnCreateArticle(oItem)
    {
        Database.oDatabase.articles_last_id++
        Database.oDatabase.articles.push({
            id: Database.oDatabase.articles_last_id,
            category_id: null,
            html: '',
            ...oItem
        })
        emitter.emit('database-article-saved')
    }

    static fnSaveCurrentArticle(sContent)
    {
        var oA = Database.fnGetCurrentArticle()
        if (oA) {
            oA.html = sContent
        }
        emitter.emit('database-article-saved')
        // emitter.emit('database-db-save')
    }

    // ===============================================================

    static fnSelectGroup(sID)
    {
        Database.iSelectedGroup = sID
        emitter.emit('database-catalog-group-selected', 
            Database.iSelectedGroup,
            Database.fnGetCurrentGroup()
        )
    }

    static fnGetGroupList()
    {
        _l('fnGetArticlesList')
        emitter.emit('database-catalog-group-list-loaded', { 
            aList: Database.oDatabase.groups, 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnGetCategoryGroupList()
    {
        emitter.emit('database-catalog-category-group-list-loaded', { 
            aList: Database.oDatabase.groups, 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnFilterGroupList(sFilter)
    {
        emitter.emit('database-catalog-group-list-filter-loaded', { 
            aList: Database.fnFilterGroups(sFilter), 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnUpdateGroup(oItem)
    {
        var oNewItem = {...oItem}
        var iI = Database.oDatabase.groups.findIndex((oI) => oNewItem.id == oI.id)
        Database.oDatabase.groups.splice(iI, 1, oNewItem)
        _l('>>>', [Database.oDatabase.groups, oNewItem])
        emitter.emit('database-catalog-group-saved')
    }

    static fnRemoveGroup(sID)
    {
        var iI = Database.oDatabase.groups.findIndex((oI) => sID == oI.id)
        Database.oDatabase.groups.splice(iI, 1)
        emitter.emit('database-catalog-group-removed')
    }

    static fnCreateGroup(oItem)
    {
        Database.oDatabase.groups_last_id++
        Database.oDatabase.groups.push({
            id: Database.oDatabase.groups_last_id,
            ...oItem
        })
        emitter.emit('database-catalog-group-saved')
    }

    // ===============================================================

    static fnSelectCategory(sID)
    {
        Database.iSelectedCategory = sID
        emitter.emit('database-catalog-category-selected', 
            Database.iSelectedCategory,
            Database.fnGetCurrentCategory()
        )
    }

    static fnGetCategoryList()
    {
        _l('fnGetArticlesList')
        emitter.emit('database-catalog-category-list-loaded', { 
            aList: Database.oDatabase.categories, 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnGetCategoryForGroupList(sGroupID) {
        emitter.emit('database-catalog-category-for-group-list-loaded', { 
            aList: Database.fnFilterTreeCategoriesByGroup(sGroupID), 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnFilterCategoryList(sFilter)
    {
        emitter.emit('database-catalog-category-list-filter-loaded', { 
            aList: Database.fnFilterCurrentCategories(sFilter), 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnUpdateCategory(oItem)
    {
        var oNewItem = {...oItem}
        var iI = Database.oDatabase.categories.findIndex((oI) => oNewItem.id == oI.id)
        Database.oDatabase.categories.splice(iI, 1, oNewItem)
        emitter.emit('database-catalog-category-saved')
    }

    static fnRemoveCategory(sID)
    {
        var iI = Database.oDatabase.categories.findIndex((oI) => sID == oI.id)
        Database.oDatabase.categories.splice(iI, 1)
        emitter.emit('database-catalog-category-removed')
    }

    static fnCreateCategory(oItem)
    {
        Database.oDatabase.categories_last_id++
        Database.oDatabase.categories.push({
            id: Database.oDatabase.categories_last_id,
            ...oItem
        })
        emitter.emit('database-catalog-category-saved')
    }

    // ===============================================================

    static fnSelectTag(sID)
    {
        Database.iSelectedTag = sID
        emitter.emit('database-tag-selected', 
            Database.iSelectedTag,
            Database.fnGetCurrentTag()
        )
    }

    static fnGetTagList()
    {
        _l('fnGetArticlesList')
        emitter.emit('database-tag-list-loaded', { 
            aList: Database.oDatabase.tags, 
            sSelectedID: Database.sSelectedTag 
        })
    }

    static fnFilterTagList(sFilter)
    {
        emitter.emit('database-tag-list-filter-loaded', { 
            aList: Database.fnFilterTags(sFilter), 
            sSelectedID: Database.sSelectedTag 
        })
    }

    static fnFilterTagSelectorList(sFilter)
    {
        emitter.emit('database-tag-list-tag-selector-filter-loaded', { 
            aList: Database.fnFilterTags(sFilter), 
            sSelectedID: Database.sSelectedTag 
        })
    }


    static fnFilterTagSelectorForArticleList(iArticleID, sFilter)
    {
        _l('fnFilterTagSelectorForArticleList', iArticleID, sFilter, Database.fnFilterArticlesTags(iArticleID, sFilter))
        emitter.emit('database-tag-list-tag-selector-article-filter-loaded', { 
            aList: Database.fnFilterArticlesTags(iArticleID, sFilter), 
            sSelectedID: Database.sSelectedTag 
        })
    }

    static fnUpdateTag(oItem)
    {
        var oNewItem = {...oItem}
        var iI = Database.oDatabase.tags.findIndex((oI) => oNewItem.id == oI.id)
        Database.oDatabase.tags.splice(iI, 1, oNewItem)
        emitter.emit('database-tag-saved')
    }

    static fnRemoveTag(sID)
    {
        var iI = Database.oDatabase.tags.findIndex((oI) => sID == oI.id)
        Database.oDatabase.tags.splice(iI, 1)
        Database.oDatabase.tags_relations = Database.oDatabase.tags_relations.filter((oI) => oI.tag_id != sID)
        emitter.emit('database-tag-removed')
    }

    static fnCreateTag(oItem)
    {
        Database.oDatabase.tags_last_id++
        Database.oDatabase.tags.push({
            id: Database.oDatabase.tags_last_id,
            ...oItem
        })
        emitter.emit('database-tag-saved')
    }

    static fnArticleRemoveTags(iArticleID, aIDs)
    {
        Database.oDatabase.tags_relations = Database.oDatabase.tags_relations.filter((oI) => ~aIDs.indexOf(oI.tag_id) && oI.article_id == iArticleID)
        _l('>>>', Database.oDatabase.tags_relations)
        emitter.emit('database-tag-list-tag-selector-remove-tags-success')
    }

    static fnArticleAddTags(iArticleID, aIDs)
    {
        // Database.oDatabase.tags_relations = Database.oDatabase.tags_relations.filter((oI) => !~aIDs.indexOf(oI.tag_id) && oI.article_id == iArticleID)
        aIDs = aIDs.filter((sID) => !~Database.oDatabase.tags_relations.findIndex((oI) => oI.tag_id == sID && oI.article_id == iArticleID))
        Database.oDatabase.tags_relations = Database.oDatabase.tags_relations.concat(aIDs.map((sID) => {
            Database.oDatabase.tags_relations_last_id++;
            return {
                id: Database.oDatabase.tags_relations_last_id,
                tag_id: sID,
                article_id: iArticleID
            }
        }))
        _l('>>>', Database.oDatabase.tags_relations)
        emitter.emit('database-tag-list-tag-selector-add-tags-success')
    }

    // ===============================================================

    static fnSelectFavorites(sID)
    {
        Database.sSelectedArticleID = sID
        emitter.emit('database-tag-selected', Database.sSelectedArticleID)
    }

    static fnFilterFavoritesArticlesList(sFilter)
    {
        emitter.emit('database-favorites-article-list-filter-loaded', { 
            aList: Database.fnFilterFavorites(sFilter), 
            sSelectedID: Database.sSelectedArticleID 
        })
    }

    static fnUpdateFavorites(iIndex, oItem)
    {
        
    }

    static fnRemoveFavorites(iIndex)
    {
        
    }

    static fnCreateFavorites()
    {
        
    }

    // ===============================================================

    static fnSelectLink(sID)
    {
        Database.iSelectedLink = sID
        emitter.emit('database-link-selected', 
            Database.iSelectedLink,
            Database.fnGetCurrentLink()
        )
    }

    static fnGetLinkList()
    {
        _l('fnGetArticlesList')
        emitter.emit('database-link-list-loaded', { 
            aList: Database.oDatabase.links, 
            sSelectedID: Database.iSelectedLink 
        })
    }

    static fnFilterLinkList(sFilter)
    {
        emitter.emit('database-link-list-filter-loaded', { 
            aList: Database.fnFilterLinks(sFilter), 
            sSelectedID: Database.iSelectedLink 
        })
    }

    static fnUpdateLink(oItem)
    {
        var oNewItem = {...oItem}
        var iI = Database.oDatabase.links.findIndex((oI) => oNewItem.id == oI.id)
        Database.oDatabase.links.splice(iI, 1, oNewItem)
        emitter.emit('database-link-saved')
    }

    static fnRemoveLink(sID)
    {
        var iI = Database.oDatabase.links.findIndex((oI) => sID == oI.id)
        Database.oDatabase.links.splice(iI, 1)
        emitter.emit('database-link-removed')
    }

    static fnCreateLink(oItem)
    {
        Database.oDatabase.links_last_id++
        Database.oDatabase.links.push({
            id: Database.oDatabase.links_last_id,
            ...oItem
        })
        emitter.emit('database-link-saved')
    }

    // ===============================================================

    static fnGetArticlePath(iID)
    {
        return `articles/${iID}.md`
    }

    static fnGetArticlePathURL(iID)
    {
        return `blob/main/articles/${iID}.md`
    }

    static fnOpenArticleURL()
    {
        var sPath = Database.fnGetArticlePathURL(Database.sSelectedArticleID)
        window.open(`https://github.com/${Database.sLogin}/${Database.sRepo}/${sPath}`)
    }

    // ===============================================================

    static fnGetArticleCategory(sID)
    {
        return Database.oDatabase.categories.filter((oI) => oI.id == sID)[0]
    }

    static fnGetArticleGroup(sID)
    {
        return Database.oDatabase.groups.filter((oI) => oI.id == sID)[0]
    }

    static fnFilterCurrentCategories(sFilter)
    {
        return Database.oDatabase.categories.filter((oI) => ~oI.name.indexOf(sFilter) && oI.group_id == Database.iSelectedGroup)
    }

    static fnFilterCurrentArticles(sFilter)
    {
        return Database.oDatabase.articles.filter((oI) => ~oI.name.indexOf(sFilter) && oI.category_id == Database.iSelectedCategory)
    }

    static fnGetFavorites()
    {
        return Database.oDatabase.articles.filter((oI) => ~Database.oDatabase.favorites.findIndex((oFI) => oI.id == oFI.id))
    }

    static fnFilterFavorites(sFilter)
    {
        return Database.fnGetFavorites().filter((oI) => ~oI.name.indexOf(sFilter))
    }

    static fnFilterLinks(sFilter)
    {
        return Database.oDatabase.links.filter((oI) => ~oI.name.indexOf(sFilter))
    }

    static fnGetArticlesTags(oArticleID)
    {
        return Database.oDatabase.tags.filter((oI) => ~Database.oDatabase.tags_relations.findIndex((oFI) => oArticleID == oFI.article_id && oFI.tag_id == oI.id))
    }

    static fnFilterArticlesTags(oArticleID, sFilter)
    {
        return Database.fnGetArticlesTags(oArticleID).filter((oI) => ~oI.name.indexOf(sFilter))
    }

    static fnGetTagsArticles(sTagID)
    {
        return Database.oDatabase.articles.filter((oI) => ~Database.oDatabase.tags_relations.findIndex((oFI) => oI.id == oFI.article_id && oFI.tag_id == sTagID))
    }

    static fnFilterTagsArticles(sTagID, sFilter)
    {
        return Database.fnGetTagsArticles(sTagID).filter((oI) => ~oI.name.indexOf(sFilter))
    }

    static fnFilterCurrentTagsArticles(sFilter)
    {
        return Database.fnFilterTagsArticles(Database.iSelectedTag, sFilter)
    }

    static fnFilterTags(sFilter)
    {
        return Database.oDatabase.tags.filter((oI) => ~oI.name.indexOf(sFilter))
    }

    static fnFilterGroups(sFilter)
    {
        return Database.oDatabase.groups.filter((oI) => ~oI.name.indexOf(sFilter))
    }

    static fnFilterTreeCategoriesByGroup(sID)
    {
        var aChildren = Database.oDatabase.categories.filter((oI) => oI.group_id == sID && oI.parent_id*1 === 0)
        var aCategories = JSON.parse(JSON.stringify(aChildren))
        var aOutput = []
        
        for (var oCategory of aCategories) {
            // oCategory.name = oCategory.parent_id + ' ' + oCategory.name
            aOutput = aOutput.concat([oCategory])
            aCategories = Database.fnFilterCategoriesByParent(oCategory.id)
            aOutput = aOutput.concat(aCategories)
        }

        // _l('>>>>', [sID, aOutput])

        return aOutput
    }

    static fnFilterCategoriesByGroup(sID)
    {
        return Database.oDatabase.categories.filter((oI) => oI.group_id == sID && oI.parent_id*1 === 0)
    }

    static fnFilterCategoriesByParent(sID, iLevel=1)
    {
        var aChildren = Database.oDatabase.categories.filter((oI) => oI.parent_id == sID)
        var aCategories = JSON.parse(JSON.stringify(aChildren))
        var aOutput = []
        
        for (var oCategory of aCategories) {
            oCategory.name = '--'.repeat(iLevel) + (iLevel > 0 ? '--' : '') + oCategory.name
            aOutput = aOutput.concat([oCategory])
            aCategories = Database.fnFilterCategoriesByParent(oCategory.id, iLevel+1)
            aOutput = aOutput.concat(aCategories)
        }

        return aOutput
    }

    static fnFilterCategories(sFilter)
    {
        return Database.oDatabase.categories.filter((oI) => ~oI.name.indexOf(sFilter))
    }

    static fnFilterArticles(sFilter)
    {
        return Database.oDatabase.articles.filter((oI) => ~oI.name.indexOf(sFilter))
    }

    static fnGetCurrentGroup()
    {
        return Database.oDatabase.groups.find((oI) => oI.id==Database.iSelectedGroup)
    }

    static fnGetCurrentCategory()
    {
        return Database.oDatabase.categories.find((oI) => oI.id==Database.iSelectedCategory)
    }

    static fnGetCurrentArticle()
    {
        return Database.oDatabase.articles.find((oI) => oI.id==Database.sSelectedArticleID)
    }

    static fnGetCurrentLink()
    {
        return Database.oDatabase.links.find((oI) => oI.id==Database.iSelectedLink)
    }

    static fnGetCurrentTag()
    {
        return Database.oDatabase.tags.find((oI) => oI.id==Database.iSelectedTag)
    }

    static fnFilterCategoriesByGroup(iGroupID)
    {
        return Database.oDatabase.categories.filter((oI) => oI.group_id == iGroupID)
    }

    static fnFilterArticlesByCategory(iCategoryID)
    {
        return Database.oDatabase.articles.filter((oI) => oI.category_id == iCategoryID)
    }

    static fnFilterArticlesByID(iID)
    {
        return Database.oDatabase.articles.filter((oI) => oI.id == iID)
    }
}