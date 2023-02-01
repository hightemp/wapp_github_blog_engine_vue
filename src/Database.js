import { Octokit } from "@octokit/rest";
import { encode, decode } from 'js-base64';

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

    static oDefaultDatabase = {
        "groups_last_id": 3,
        "groups": [
            {"id":1, "name": "Супер-пупер группа 1"},
            {"id":2, "name": "Супер-пупер группа 2"},
            {"id":3, "name": "Супер-пупер группа 3"},
        ],
        "categories_last_id": 4,
        "categories": [
            {"id":1, "name": "Категория 1", "is_opened": false, "parent_id": null, "group_id": "1"},
            {"id":2, "name": "Категория 2", "is_opened": false, "parent_id": "1", "group_id": "1"},
            {"id":3, "name": "Супер-пупер Категория 3", "is_opened": false, "parent_id": "2", "group_id": "1"},
            {"id":4, "name": "Категория 4", "is_opened": false, "parent_id": null, "group_id": "1"},
        ],
        "articles_last_id": 6,
        "articles": [
            {"id":1, "name": "Banken, die die auf internationaler Ebene hat", "category_id": "1", "html": "<b>Banken, die die auf internationaler Ebene hat</b> der Ausschuss eine Reihe einheitlicher Kennzahlen entwickelt, dies als das Minimum hinaus betreffen. Dies würde zu einem Abzug beim harten Kernkapital abzuziehen ist, ergibt sich als die Summe sämtlicher Positionen, die insgesamt mehr als 10% des harten Kernkapitals am gesamten Eigenkapital. Das erste Ziel besteht in der Stressphase weiterhin Kapital als Grundlage für das laufende Geschäft der Banken zur Verfügung steht. Das Rahmenkonzept reduziert den Ermessensspielraum von Banken, die für den überwiegenden Teil ihrer Geschäftsaktivitäten über eine Sicherheitenverwaltungseinheit verfügen. Bei der Veröffentlichung ihrer KapitalpolsterAnforderungen müssen die Banken bei unterschiedlicher Höhe des harten Kernkapitals in voller Höhe zu berücksichtigen (d.h. Derartige zum Ausgleich herangezogene Vermögenswerte sollten mit dem prozentualen Anteil der Positionen des harten Kernkapitals in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Bewertung von wesentlichen Beteiligungen am Kapital von Bank-, Finanz- und Versicherungsinstituten, die ausserhalb des aufsichtsrechtlichen Konsolidierungskreises liegen, einbezogen wurde. Mit Ausnahme von Bedienungsrechten von Hypotheken ist der volle Betrag in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Kapitalklasse vorgenommen werden, der das Kapital bei Emission durch die Bank selbst zugeordnet würde. Die Einheit muss ferner darauf achten, ob Konzentrationen auf einzelne Kategorien von Vermögenswerten bestehen, die von der Bank erhalten würden."},
            {"id":2, "name": "Derartige zum Ausgleich herangezogene", "category_id": "1", "html": "dfasdf"},
            {"id":3, "name": "Mit Ausnahme von Bedienungsrechten von Hypotheken ist der volle Betrag in Abzug zu bringen", "category_id": "1", "html": "asdfas fdasf"},
            {"id":4, "name": "das Kapital bei Emission durch die Bank", "category_id": "1", "html": "sadf asfdasf asdf"},
            {"id":5, "name": "Derartige zum Ausgleich", "category_id": "2", "html": "sadf asfdasf asdf"},
            {"id":6, "name": "der bei der Kapitalklasse vorgenommen werden", "category_id": "3", "html": "sadf asfdasf asdf"},
        ],
        "favorites_last_id": 1,
        "favorites": [
            {"id":1, "article_id":"1"},
        ],
        "tags_last_id": 4,
        "tags": [
            {"id":1, "name":"computer"},
            {"id":2, "name":"testing"},
            {"id":3, "name":"development"},
            {"id":4, "name":"lorem"},
        ],
        "tags_relations_last_id": 2,
        "tags_relations": [
            {"id":1, "tag_id":1, "article_id":1},
            {"id":2, "tag_id":4, "article_id":1},
        ],
        "links_last_id": 4,
        "links": [
            {"id":1, "name":"test link 1", "url":"https://www.youtube.com/watch?v=7HysFi1NHdI"},
            {"id":2, "name":"test link 2", "url":"https://www.youtube.com/watch?v=7HysFi1NHdI"},
            {"id":3, "name":"test link 3", "url":"https://www.youtube.com/watch?v=7HysFi1NHdI"},
            {"id":4, "name":"test link 4", "url":"https://www.youtube.com/watch?v=7HysFi1NHdI"},
        ],
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

    static fnInitGit()
    {
        _s('Database.fnInitGit')
        Database.octokit = new Octokit({
            auth: Database.sAPIKey,
        });
    }

    // ===============================================================

    static fnInit()
    {
        // emitter.on('app-created', Database.fnFirstLoadDatabase)
        emitter.on('database-repos-load', Database.fnLoadReposList)
        emitter.on('database-repos-save', Database.fnSaveReposList)
        emitter.on('database-repos-update', Database.fnUpdateRepo)
        emitter.on('database-repos-remove', Database.fnRemoveRepo)
        emitter.on('database-repos-add', Database.fnAddRepo)
        emitter.on('database-repos-select', Database.fnSelectRepo)
        emitter.on('database-repos-clean', Database.fnCleanRepo)
        // emitter.on('database-load', FileSystemDriver.fnReadDatabase)
        // emitter.on('database-save', FileSystemDriver.fnWriteDatabase)

        emitter.on('database-repos-select-accept', Database.fnRepoSelected)
        emitter.on('database-db-load', Database.fnReadDatabase)
        emitter.on('database-db-save', Database.fnWriteDatabase)

        emitter.on('database-article-list', Database.fnGetArticlesList)
        emitter.on('database-article-list-filter', Database.fnFilterArticlesList)
        emitter.on('database-catalog-article-list-filter', Database.fnFilterCatalogArticlesList)
        emitter.on('database-tag-article-list-filter', Database.fnFilterTagArticlesList)
        emitter.on('database-favorites-article-list-filter', Database.fnFilterFavoritesArticlesList)
        emitter.on('database-article-update', Database.fnUpdateArticle)
        emitter.on('database-article-remove', Database.fnRemoveArticle)
        emitter.on('database-article-add', Database.fnCreateArticle)
        emitter.on('database-article-select', Database.fnSelectArticle)
        emitter.on('database-article-save-current-content', Database.fnSaveCurrentArticle)

        emitter.on('database-catalog-group-list', Database.fnGetGroupList)
        emitter.on('database-catalog-group-list-filter', Database.fnFilterGroupList)
        emitter.on('database-catalog-category-group-list', Database.fnGetCategoryGroupList)
        emitter.on('database-catalog-group-update', Database.fnUpdateGroup)
        emitter.on('database-catalog-group-remove', Database.fnRemoveGroup)
        emitter.on('database-catalog-group-add', Database.fnCreateGroup)
        emitter.on('database-catalog-group-select', Database.fnSelectGroup)

        emitter.on('database-catalog-category-list', Database.fnGetCategoryList)
        emitter.on('database-catalog-category-list-filter', Database.fnFilterCategoryList)
        emitter.on('database-catalog-category-for-group-list', Database.fnGetCategoryForGroupList)
        emitter.on('database-catalog-category-update', Database.fnUpdateCategory)
        emitter.on('database-catalog-category-remove', Database.fnRemoveCategory)
        emitter.on('database-catalog-category-add', Database.fnCreateCategory)
        emitter.on('database-catalog-category-select', Database.fnSelectCategory)

        emitter.on('database-tag-list', Database.fnGetTagList)
        emitter.on('database-tag-list-filter', Database.fnFilterTagList)
        emitter.on('database-tag-list-tag-selector-filter', Database.fnFilterTagSelectorList)
        emitter.on('database-tag-list-tag-selector-article-filter', Database.fnFilterTagSelectorForArticleList)
        emitter.on('database-tag-update', Database.fnUpdateTag)
        emitter.on('database-tag-remove', Database.fnRemoveTag)
        emitter.on('database-tag-add', Database.fnCreateTag)
        emitter.on('database-tag-select', Database.fnSelectTag)
        emitter.on('database-tag-list-tag-selector-remove-tags', Database.fnArticleRemoveTags)
        emitter.on('database-tag-list-tag-selector-add-tags', Database.fnArticleAddTags)

        emitter.on('database-favorites-update', Database.fnUpdateFavorites)
        emitter.on('database-favorites-remove', Database.fnRemoveFavorites)
        emitter.on('database-favorites-add', Database.fnCreateFavorites)
        emitter.on('database-favorites-select', Database.fnSelectFavorites)

        emitter.on('database-link-list', Database.fnGetLinkList)
        emitter.on('database-link-list-filter', Database.fnFilterLinkList)
        emitter.on('database-link-update', Database.fnUpdateLink)
        emitter.on('database-link-remove', Database.fnRemoveLink)
        emitter.on('database-link-add', Database.fnCreateLink)
        emitter.on('database-link-select', Database.fnSelectLink)

        emitter.on('database-article-open-url', Database.fnOpenArticleURL)
    }

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
            .fnReadDatabase()
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
        emitter.emit('database-catalog-article-selected', 
            Database.sSelectedArticleID, 
            Database.fnGetCurrentArticle()
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
        oA.html = sContent
        emitter.emit('database-article-saved')
        emitter.emit('database-db-save')
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
            Database.iSelectedTag
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

    static fnUpdateTag(iIndex, oItem)
    {
        
    }

    static fnRemoveTag(iIndex)
    {
        
    }

    static fnCreateTag()
    {
        
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
        emitter.emit('database-link-selected', Database.iSelectedLink)
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

    static fnUpdateLink(iIndex, oItem)
    {
        
    }

    static fnRemoveLink(iIndex)
    {
        
    }

    static fnCreateLink()
    {
        
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