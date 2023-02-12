import { createStore } from 'vuex'

import demo_database from './demo_database'
import { FileSystemDriver } from './FileSystemDriver'

import { fnRandomString } from './lib'

// NOTE: Константы
export const DATABASE_PATH = "notes-database.json"
export const DATABASE_UPDATE_TIMEOUT = 30000

function fnFindCategoryRoot(state, sID) 
{
    var oC = state.oDatabase.categories.find((oI) => oI.id == sID)
    if (oC.parent_id) {
        return fnFindCategoryRoot(state, oC.parent_id)
    } else {
        return oC
    }
}

const oDefaultDatabase = {
    "groups_last_id": 0,
    "groups": [],
    "categories_last_id": 0,
    "categories": [],
    "articles_last_id": 0,
    "articles": [],
    "favorites_last_id": 0,
    "favorites": [],
    "tags_last_id": 0,
    "tags": [],
    "tags_relations_last_id": 0,
    "tags_relations": [],
    "links_last_id": 0,
    "links": [],
}

// Create a new store instance.
export default createStore({
    state () {
        return {
            // NOTE: Репозитории
            aReposList: [],
            oRepo: null,
            iSelectedRepoIndex: null,

            bSaveEditor: false,
            
            // NOTE: Окна
            bShowErrorWindow: false,
            sErrorWindowMessage: "",
            sErrorWindowTitle: "",
            bShowRepoWindow: true,

            bShowGroupEditWindow: false,
            oGroupEditItem: null,

            sGroupEditWindowGroupName: "",

            bShowCategoryEditWindow: false,
            oCategoryEditItem: null,

            sCategoryEditWindowCategoryName: "",
            sCategoryEditWindowGroupID: "",
            sCategoryEditWindowCategoryID: "",

            bShowArticleEditWindow: false,
            oArticleEditItem: null,

            sArticleEditWindowArticleName: "",
            sArticleEditWindowGroupID: "",
            sArticleEditWindowCategoryID: "",

            bShowTagEditWindow: false,
            oTagEditItem: null,
            sTagEditWindowTagName: "",

            bShowLinkEditWindow: false,
            oLinkEditItem: null,
            sLinkEditWindowLinkName: "",
            sLinkEditWindowLinkURL: "",

            bShowRepoWindow: true,

            // NOTE: тоасты
            bShowSaveToast: false,

            // NOTE: Лоадеры, Блокаторы
            bShowLoader: false,

            // NOTE: Редактор
            bShowEditor: false,

            sArticleContent: "",

            // NOTE: Режимы
            sCurrentMode: "",

            iEditIndex: null,

            // NOTE: База Данных
            oDatabase: oDefaultDatabase,

            sSelectedArticleID: null,
            sSelectedCategoryID: null,
            sSelectedGroupID: null,
            sSelectedTagID: null,
            sSelectedLinkID: null,
        }
    },
    mutations: {
        fnReposRemove(state, iIndex) {
            state.aReposList.splice(iIndex, 1)
            localStorage.setItem('aReposList', JSON.stringify(state.aReposList))
        },
        fnReposSelect(state, iIndex) {
            state.iSelectedRepoIndex = iIndex
        },
        fnReposClean(state) {
            state.aReposList = []
            localStorage.setItem('aReposList', JSON.stringify(state.aReposList))
        },
        fnReposUpdate(state, { iIndex, oObj }) {
            if (iIndex==-1) {
                state.aReposList.push(oObj)
            } else {
                state.aReposList.splice(iIndex, 1, oObj)
            }
            localStorage.setItem('aReposList', JSON.stringify(state.aReposList))
        },
        fnLoadRepos(state) {
            try { 
                state.aReposList = JSON.parse(localStorage.getItem('aReposList') || '[]')
            } catch(_) {

            }
        },
        fnUpdateDatabase(state, oDatabase) {
            state.oDatabase = oDatabase
        },
        fnHideRepoWindow(state) {
            state.bShowRepoWindow = false
        },
        fnShowRepoWindow(state) {
            state.bShowRepoWindow = true
        },
        fnShowLoader(state) {
            state.bShowLoader = true
        },
        fnHideLoader(state) {
            state.bShowLoader = false
        },
        fnShowEditor(state) {
            state.bShowEditor = true
        },
        fnHideEditor(state) {
            state.bShowEditor = false
        },
        fnSelectGroup(state, sID) {
            state.sSelectedGroupID = sID
        },
        fnSelectCategory(state, sID) {
            state.sSelectedCategoryID = sID
        },
        fnSelectArticle(state, sID) {
            state.sSelectedArticleID = sID
        },
        fnSelectTag(state, sID) {
            state.sSelectedTagID = sID
        },
        fnSelectLink(state, sID) {
            state.sSelectedLinkID = sID
        },
        fnSetArticleContent(state, sContent) {
            state.sArticleContent = sContent
        },
        fnUpdateMode(state, sMode) {
            state.sCurrentMode = sMode
        },

        fnCleanDatabase(state) {
            state.oDatabase = oDefaultDatabase
        },
        fnLoadDemoDatabase(state) {
            state.oDatabase = demo_database
        },

        fnShowGroupEditWindow(state, oItem) {
            state.bShowGroupEditWindow = true
            state.oGroupEditItem = oItem
            _l('>>>', oItem)
            if (oItem) {
                state.sGroupEditWindowGroupName = oItem.name
            } else {
                state.sGroupEditWindowGroupName = ""
            }
        },
        fnHideGroupEditWindow(state) {
            state.bShowGroupEditWindow = false
        },
        fnShowCategoryEditWindow(state, oItem) {
            state.bShowCategoryEditWindow = true
            state.oCategoryEditItem = oItem
            if (oItem) {
                state.sCategoryEditWindowCategoryName = oItem.name
                var oC = fnFindCategoryRoot(state, oItem.id)
                _l(">>>", oC)
                state.sCategoryEditWindowGroupID = oC?.group_id
                state.sCategoryEditWindowCategoryID = oItem.parent_id
            } else {
                state.sCategoryEditWindowCategoryName = ""
                state.sCategoryEditWindowGroupID = ""
                state.sCategoryEditWindowCategoryID = ""
            }
        },
        fnHideCategoryEditWindow(state) {
            state.bShowCategoryEditWindow = false
        },
        fnShowArticleEditWindow(state, oItem) {
            state.bShowArticleEditWindow = true
            state.oArticleEditItem = oItem
            if (oItem) {
                state.sArticleEditWindowArticleName = oItem.name
                var oC = state.oDatabase.categories.find((oI) => oI.id == oItem.category_id)
                state.sArticleEditWindowGroupID = oC?.group_id
                state.sArticleEditWindowCategoryID = oItem.category_id
            } else {
                state.sArticleEditWindowArticleName = ""
                state.sArticleEditWindowCategoryID = ""
                state.sArticleEditWindowGroupID = ""
            }
        },
        fnHideArticleEditWindow(state) {
            state.bShowArticleEditWindow = false
        },
        fnShowTagEditWindow(state, oItem) {
            state.bShowTagEditWindow = true
            state.oTagEditItem = oItem
            if (oItem) {
                state.sTagEditWindowTagName = oItem.name
            } else {
                state.sTagEditWindowTagName = ""
            }
        },
        fnHideTagEditWindow(state) {
            state.bShowTagEditWindow = false
        },
        fnShowLinkEditWindow(state, oItem) {
            state.bShowLinkEditWindow = true
            state.oLinkEditItem = oItem
            if (oItem) {
                state.sLinkEditWindowLinkName = oItem.name
                state.sLinkEditWindowLinkURL = oItem.url
            } else {
                state.sLinkEditWindowLinkName = ""
                state.sLinkEditWindowLinkURL = ""
            }
        },
        fnHideLinkEditWindow(state) {
            state.bShowLinkEditWindow = false
        },

        fnUpdateDatabaseTable(state, { sTableName, sField, sV }) {
            state.oDatabase[sTableName][sField] = sV
        },
        fnUpdateVar(state, { sName, sV }) {
            state[sName] = sV
        },

        fnAddGroup(state, oItem) {
            state.oDatabase.groups_last_id++
            oItem = {
                ...oItem,
                id: state.oDatabase.groups_last_id
            }
            state.oDatabase.groups.push(oItem)
        },
        fnUpdateGroup(state, { iIndex, oItem }) {
            state.oDatabase.groups.splice(iIndex, 1, oItem)
        },
        fnRemoveGroup(state, iIndex) {
            state.oDatabase.groups.splice(iIndex, 1)
        },

        fnAddCategory(state, oItem) {
            state.oDatabase.categories_last_id++
            oItem = {
                ...oItem,
                id: state.oDatabase.categories_last_id
            }
            state.oDatabase.categories.push(oItem)
        },
        fnUpdateCategory(state, { iIndex, oItem }) {
            state.oDatabase.categories.splice(iIndex, 1, oItem)
        },
        fnRemoveCategory(state, iIndex) {
            state.oDatabase.categories.splice(iIndex, 1)
        },

        fnAddArticle(state, oItem) {
            state.oDatabase.articles_last_id++
            oItem = {
                ...oItem,
                id: state.oDatabase.articles_last_id
            }
            state.oDatabase.articles.push(oItem)
        },
        fnUpdateArticle(state, { iIndex, oItem }) {
            state.oDatabase.articles.splice(iIndex, 1, oItem)
        },
        fnRemoveArticle(state, iIndex) {
            state.oDatabase.articles.splice(iIndex, 1)
        },

        fnAddTag(state, oItem) {
            state.oDatabase.tags_last_id++
            oItem = {
                ...oItem,
                id: state.oDatabase.tags_last_id
            }
            state.oDatabase.tags.push(oItem)
        },
        fnUpdateTag(state, { iIndex, oItem }) {
            _l('>>>', oItem)
            state.oDatabase.tags.splice(iIndex, 1, oItem)
        },
        fnRemoveTag(state, iIndex) {
            state.oDatabase.tags.splice(iIndex, 1)
        },
        fnRemoveTagRelation(state, iIndex) {
            state.oDatabase.tags_relations.splice(iIndex, 1)
        },

        fnAddLink(state, oItem) {
            state.oDatabase.links_last_id++
            oItem = {
                ...oItem,
                id: state.oDatabase.links_last_id
            }
            state.oDatabase.links.push(oItem)
        },
        fnUpdateLink(state, { iIndex, oItem }) {
            state.oDatabase.links.splice(iIndex, 1, oItem)
        },
        fnRemoveLink(state, iIndex) {
            state.oDatabase.links.splice(iIndex, 1)
        },

        fnSaveArticleContent(state, { iIndex, sContent }) {
            state.sArticleContent = sContent
            // state.oDatabase.articles[iIndex].html = sContent
        },

        fnAddFavorite(state, oItem) {
            if (~state.oDatabase.findIndex((oI) => oI.id == oItem.id)) {
                return
            }
            state.oDatabase.articles_last_id++
            state.oDatabase.favorites.push({ 
                id: state.oDatabase.articles_last_id, 
                article_id: oItem.id 
            })
        },
        fnRemoveFavorite(state, oItem) {
            var iI = state.oDatabase.favorites.findIndex((oI) => oI.article_id == oItem.id)
            state.oDatabase.favorites.splice(iI, 1)
        }
    },
    actions: {
        fnPrepareRepo({ commit, state, dispatch, getters }) {
            commit('fnHideRepoWindow')
            FileSystemDriver.fnInit(getters.oCurrentRepo)
            dispatch('fnLoadDatabase')
        },
        fnSaveDatabase({ commit, state }) {
            return FileSystemDriver.fnWriteFileJSON(DATABASE_PATH, state.oDatabase)
        },
        fnSaveArticlePage({ commit, state, getters }) {
            if (getters.oCurrentArticle) {
                var sPath = getters.fnGetCurrentArticlePath()
                // FileSystemDriver.fnReadFile(sPath)
                FileSystemDriver.fnWriteFile(sPath, state.sArticleContent)
                    .catch(() => {
                        FileSystemDriver.fnReadFile(sPath)
                        .then(() => {
                            FileSystemDriver.fnWriteFile(sPath, state.sArticleContent)
                        })
                    })
            }
        },
        fnLoadDatabase({ commit, state }) {
            commit('fnShowLoader')
            FileSystemDriver
                .fnReadFileJSON(DATABASE_PATH)
                .then((mData) => { 
                    commit('fnUpdateDatabase', mData)
                    // commit('fnUpdateDatabase', mData=demo_database)
                    commit('fnHideLoader')
                })
                .catch((oE) => {
                    if ((oE+"").match(/Not Found/)) {
                        _l(">>>",oE+"")
                        FileSystemDriver.fnWriteFileJSON(DATABASE_PATH, state.oDatabase)
                            .then(() => {
                                FileSystemDriver
                                    .fnReadFileJSON(DATABASE_PATH)
                                    .then((mData) => { 
                                        commit('fnUpdateDatabase', mData)
                                        commit('fnHideLoader')
                                    })
                            })
                    }
                })
        },
        fnPublishIndexFile({ commit, state }) {
            var sContent = "# Оглавление\n\n"
            for (var oA of state.oDatabase.articles) {
                sContent += `- [${oA.name}](/pages/${oA.hash_name}.html)\n`
            }
            
            FileSystemDriver.fnWriteFile("README.md", sContent)
                .catch(() => {
                    FileSystemDriver.fnReadFile("README.md")
                        .then(()=>FileSystemDriver.fnWriteFile("README.md", sContent))
                })
        },
        fnUpdateGroup({ commit, getters }, oItem) {
            var iIndex = getters.fnGetGroupIndex(oItem.id)
            commit('fnUpdateGroup', { iIndex, oItem })
        },
        fnUpdateCategory({ commit, getters }, oItem) {
            var iIndex = getters.fnGetCategoryIndex(oItem.id)
            commit('fnUpdateCategory', { iIndex, oItem })
        },
        fnUpdateArticle({ commit, getters }, oItem) {
            var iIndex = getters.fnGetArticleIndex(oItem.id)
            commit('fnUpdateArticle', { iIndex, oItem })
        },
        fnUpdateTag({ commit, getters }, oItem) {
            var iIndex = getters.fnGetTagIndex(oItem.id)
            commit('fnUpdateTag', { iIndex, oItem })
        },
        fnUpdateLink({ commit, getters }, oItem) {
            var iIndex = getters.fnGetLinkIndex(oItem.id)
            commit('fnUpdateLink', { iIndex, oItem })
        },
        fnRemoveGroup({ state, dispatch, commit, getters }, oItem) {
            var aC = state.oDatabase.categories.filter((oI) => ~oI.group_id==oItem.id)
            for (var oC of aC) {
                dispatch('fnRemoveCategory', oC)
            }
            var iIndex = getters.fnGetGroupIndex(oItem.id)
            commit('fnRemoveGroup', iIndex)
        },
        fnRemoveCategory({ state, dispatch, commit, getters }, oItem) {
            var aC = state.oDatabase.categories.filter((oI) => oI.parent_id==oItem.id)
            for (var oC of aC) {
                dispatch('fnRemoveCategory', oC)
            }
            state.oDatabase.articles = state.oDatabase.articles.filter((oI) => oI.category_id!=oItem.id)
            state.oDatabase.categories = state.oDatabase.categories.filter((oI) => oI.parent_id!=oItem.id)
            var iIndex = getters.fnGetCategoryIndex(oItem.id)
            commit('fnRemoveCategory', iIndex)
        },
        fnRemoveArticle({ commit, getters, state }, oItem) {
            var iRelIndex = null;
            while (~(iRelIndex = getters.fnGetTagRelationIndexForArticle(oItem.id))) {
                commit('fnRemoveTagRelation', iRelIndex)
            }
            while (~(iRelIndex = getters.fnGetFavoriteIndexForArticle(oItem.id))) {
                commit('fnRemoveFavorite', iRelIndex)
            }
            var iIndex = getters.fnGetArticleIndex(oItem.id)
            commit('fnRemoveArticle', iIndex)
        },
        fnRemoveTag({ commit, getters }, oItem) {
            var iIndex = getters.fnGetTagIndex(oItem.id)
            commit('fnRemoveTag', iIndex)
        },
        fnRemoveLink({ commit, getters }, oItem) {
            var iIndex = getters.fnGetLinkIndex(oItem.id)
            commit('fnRemoveLink', iIndex)
        },

        async fnSelectArticle({ commit, state, getters }, sID) {
            commit('fnSelectArticle', sID)
            _l(">>>", sID)
            if (sID) {
                var sP = getters.fnGetCurrentArticlePath()
                FileSystemDriver.fnCreateDir("/pages/")
                var oEx = ""
                FileSystemDriver.fnReadFile(sP)
                    .then(({ sData, sSHA }) => {
                        commit('fnShowEditor')
                        commit('fnSetArticleContent', sData) 
                    })
                    .catch((oE) => {
                        if ((oE+"").match(/Not Found/)) {
                            FileSystemDriver.fnWriteFile(sP, "")
                            commit('fnShowEditor')
                            commit('fnSetArticleContent', "")
                        }
                    })
            }
        },


        fnSaveGroup({ commit, dispatch, getters, state }) {
            if (state.oGroupEditItem===null) {
                var oItem = { name: state.sGroupEditWindowGroupName }
                commit('fnAddGroup', oItem)
            } else {
                state.oGroupEditItem.name = state.sGroupEditWindowGroupName
                dispatch('fnUpdateGroup', state.oGroupEditItem)
            }
        },

        fnSaveCategory({ commit, dispatch, getters, state }) {
            if (state.oCategoryEditItem===null) {
                var oItem = { 
                    name: state.sCategoryEditWindowCategoryName,
                    parent_id: sCategoryEditWindowCategoryID
                }
                commit('fnAddCategory', oItem)
            } else {
                state.oCategoryEditItem.name = state.sCategoryEditWindowCategoryName
                state.oCategoryEditItem.parent_id = state.sCategoryEditWindowCategoryID
                dispatch('fnUpdateCategory', state.oCategoryEditItem)
            }
        },

        fnSaveArticle({ commit, dispatch, getters, state }) {
            if (state.oArticleEditItem===null) {
                var oItem = { 
                    name: state.sArticleEditWindowArticleName,
                    category_id: state.sArticleEditWindowCategoryID,
                    hash_name: fnRandomString(),
                    html: ""
                }
                commit('fnAddArticle', oItem)
            } else {
                state.oArticleEditItem.name = state.sArticleEditWindowArticleName
                state.oArticleEditItem.category_id = state.sArticleEditWindowCategoryID
                dispatch('fnUpdateArticle', state.oArticleEditItem)
            }
        },

        fnSaveTag({ commit, dispatch, getters, state }) {
            if (state.oTagEditItem===null) {
                var oItem = { name: state.sTagEditWindowTagName }
                commit('fnAddTag', oItem)
            } else {
                state.oTagEditItem.name = state.sTagEditWindowTagName
                dispatch('fnUpdateTag', state.oTagEditItem)
            }
        },

        fnSaveLink({ commit, dispatch, getters, state }) {
            if (state.oLinkEditItem===null) {
                var oItem = { 
                    name: state.sLinkEditWindowLinkName,
                    url: state.sLinkEditWindowLinkURL
                }
                commit('fnAddLink', oItem)
            } else {
                state.oLinkEditItem.name = state.sLinkEditWindowLinkName
                state.oLinkEditItem.url = state.sLinkEditWindowLinkURL
                dispatch('fnUpdateLink', state.oLinkEditItem)
            }
        },

        fnSaveArticleContent({ commit, getters, state }, sContent) {
            var iIndex = state.oDatabase.articles.findIndex((oI) => oI.id == getters.oCurrentArticle.id)
            commit('fnSaveArticleContent', { iIndex, sContent })
        }
    },
    getters: {
        fnGetCurrentArticlePath: (state, getters) => () => {
            return `/pages/${getters.oCurrentArticle?.hash_name}.html`
        },

        oCurrentRepo(state) {
            return state.aReposList[state.iSelectedRepoIndex]
        },

        fnGetCategory: (state) => (sID) => {
            return state.oDatabase.categories.find((oI) => oI.id == sID)
        },

        fnGetGroup: (state) => (sID) => {
            return state.oDatabase.groups.find((oI) => oI.id == sID)
        },

        fnGetArticle: (state) => (sID) => {
            return state.oDatabase.articles.find((oI) => oI.id == sID)
        },

        fnGetTagRelationIndexForArticle: (state) => (sID) => {
            return state.oDatabase.tags_relations.findIndex((oI) => oI.article_id == sID)
        },

        fnGetFavoriteIndexForArticle: (state) => (sID) => {
            return state.oDatabase.favorites.findIndex((oI) => oI.article_id == sID)
        },

        fnGetCategoryIndex: (state) => (sID) => {
            return state.oDatabase.categories.findIndex((oI) => oI.id == sID)
        },

        fnGetGroupIndex: (state) => (sID) => {
            return state.oDatabase.groups.findIndex((oI) => oI.id == sID)
        },

        fnGetArticleIndex: (state) => (sID) => {
            return state.oDatabase.articles.findIndex((oI) => oI.id == sID)
        },

        fnGetTagIndex: (state) => (sID) => {
            return state.oDatabase.tags.findIndex((oI) => oI.id == sID)
        },

        fnGetLinkIndex: (state) => (sID) => {
            return state.oDatabase.links.findIndex((oI) => oI.id == sID)
        },

        fnFilterCurrentCategories: (state) => (sFilter) => {
            return state.oDatabase.categories.filter((oI) => ~oI.name.indexOf(sFilter) && oI.group_id == state.sSelectedGroupID)
        },

        fnFilterCurrentArticles: (state) => (sFilter) => {
            return state.oDatabase.articles.filter((oI) => ~oI.name.indexOf(sFilter) && oI.category_id == state.sSelectedCategoryID)
        },

        fnGetFavorites: (state) => () => {
            return state.oDatabase.articles.filter((oI) => ~state.oDatabase.favorites.findIndex((oFI) => oI.id == oFI.id))
        },

        fnFilterFavorites: (state, getters) => (sFilter) => {
            return getters.fnGetFavorites().filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnFilterLinks: (state) => (sFilter) => {
            return state.oDatabase.links.filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnGetArticlesTags: (state) => (oArticleID) => {
            return state.oDatabase.tags.filter((oI) => ~state.oDatabase.tags_relations.findIndex((oFI) => oArticleID == oFI.article_id && oFI.tag_id == oI.id))
        },

        fnFilterArticlesTags: (state, getters) => (oArticleID, sFilter) => {
            return getters.fnGetArticlesTags(oArticleID).filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnGetTagsArticles: (state) => (sTagID) => {
            return state.oDatabase.articles.filter((oI) => ~state.oDatabase.tags_relations.findIndex((oFI) => oI.id == oFI.article_id && oFI.tag_id == sTagID))
        },

        fnFilterTagsArticles: (state, getters) => (sTagID, sFilter) => {
            return getters.fnGetTagsArticles(sTagID).filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnFilterCurrentTagsArticles: (state, getters) => (sFilter) => {
            return getters.fnFilterTagsArticles(state.sSelectedTagID, sFilter)
        },

        fnFilterTags: (state) => (sFilter) => {
            return state.oDatabase.tags.filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnFilterGroups: (state) => (sFilter) => {
            return state.oDatabase.groups.filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnFilterTreeCategoriesByGroup: (state, getters) => (sID) => {
            var aChildren = state.oDatabase.categories.filter((oI) => oI.group_id == sID && oI.parent_id*1 === 0)
            var aCategories = JSON.parse(JSON.stringify(aChildren))
            var aOutput = []
            
            for (var oCategory of aCategories) {
                // oCategory.name = oCategory.parent_id + ' ' + oCategory.name
                aOutput = aOutput.concat([oCategory])
                aCategories = getters.fnFilterCategoriesByParent(oCategory.id)
                aOutput = aOutput.concat(aCategories)
            }

            return aOutput
        },

        fnFilterRootCategoriesByGroup: (state) => (sID) => {
            return state.oDatabase.categories.filter((oI) => oI.group_id == sID && oI.parent_id*1 === 0)
        },

        fnFilterCategoriesByParent: (state, getters) => (sID, iLevel=1) => {
            var aChildren = state.oDatabase.categories.filter((oI) => oI.parent_id == sID)
            var aCategories = JSON.parse(JSON.stringify(aChildren))
            var aOutput = []
            
            for (var oCategory of aCategories) {
                oCategory.name = '--'.repeat(iLevel) + (iLevel > 0 ? '--' : '') + oCategory.name
                aOutput = aOutput.concat([oCategory])
                aCategories = getters.fnFilterCategoriesByParent(oCategory.id, iLevel+1)
                aOutput = aOutput.concat(aCategories)
            }

            return aOutput
        },

        fnFilterCategories: (state) => (sFilter) => {
            return state.oDatabase.categories.filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnFilterArticles: (state) => (sFilter) => {
            return state.oDatabase.articles.filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnFilterFavorites: (state, getters) => (sFilter) => {
            return getters.fnGetFavorites().filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnFilterTags: (state) => (sFilter) => {
            return state.oDatabase.tags.filter((oI) => ~oI.name.indexOf(sFilter))
        },

        fnFilterLinks: (state) => (sFilter) => {
            return state.oDatabase.links.filter((oI) => ~oI.name.indexOf(sFilter))
        },

        aGroupsList(state) {
            return state.oDatabase.groups
        },

        aCategoriesList(state) {
            return state.oDatabase.categories
        },

        aArticlesList() {
            return state.oDatabase.articles
        },

        aTagsList() {
            return state.oDatabase.tags
        },

        aLinksist() {
            return state.oDatabase.links
        },

        oCurrentGroup(state, getters) {
            return state.oDatabase.groups.find((oI) => oI.id==state.sSelectedGroupID)
        },

        oCurrentCategory(state, getters) {
            return state.oDatabase.categories.find((oI) => oI.id==state.sSelectedCategoryID)
        },

        oCurrentArticle(state, getters) {
            return state.oDatabase.articles.find((oI) => oI.id==state.sSelectedArticleID)
        },

        oCurrentTag(state, getters) {
            return state.oDatabase.tags.find((oI) => oI.id==state.sSelectedTagID)
        },

        oCurrentLink(state, getters) {
            return state.oDatabase.links.find((oI) => oI.id==state.sSelectedLinkID)
        },

        fnGetCurrentLink: (state) => () => {
            return state.oDatabase.links.find((oI) => oI.id==state.sSelectedLinkID)
        },

        fnGetCurrentTag: (state) => () => {
            return state.oDatabase.tags.find((oI) => oI.id==state.sSelectedTagID)
        },

        fnFilterCategoriesByGroup: (state) => (sGroupID) => {
            return state.oDatabase.categories.filter((oI) => oI.group_id == sGroupID)
        },

        fnFilterArticlesByCategory: (state) => (sCategoryID) => {
            return state.oDatabase.articles.filter((oI) => oI.category_id == sCategoryID)
        },

        fnFilterArticlesByID: (state) => (iID) => {
            return state.oDatabase.articles.filter((oI) => oI.id == iID)
        }
    }
})