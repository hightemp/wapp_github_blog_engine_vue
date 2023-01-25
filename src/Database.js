import { Octokit } from "@octokit/rest";
import { encode, decode } from 'js-base64';

import { emitter } from './EventBus'

export class Database {
    static aReposList = [
        /**
         * { "login": "", "repo": "", "key": "" }
         */
    ]

    static iSelectedRepo = null

    static oDatabase = {
        "groups_last_id": "0",
        "groups": [],
        "categories_last_id": "0",
        "categories": [],
        "articles_last_id": "0",
        "articles": [],
        "favorites_last_id": "0",
        "favorites": [],
        "tags_last_id": "0",
        "tags": [],
        "tags_relataions_last_id": "1",
        "tags_relations": []
    }

    static oDefaultDatabase = {
        "groups_last_id": "3",
        "groups": [
            {"id":1, "name": "Test 1"},
            {"id":2, "name": "Test 2"},
            {"id":3, "name": "Test 3"},
        ],
        "categories_last_id": "4",
        "categories": [
            {"id":1, "name": "Test 1", "is_opened": false, "parent_id": null, "group_id": "1"},
            {"id":2, "name": "Test 2", "is_opened": false, "parent_id": "1", "group_id": "1"},
            {"id":3, "name": "Test 3", "is_opened": false, "parent_id": "2", "group_id": "1"},
            {"id":4, "name": "Test 4", "is_opened": false, "parent_id": null, "group_id": "1"},
        ],
        "articles_last_id": "6",
        "articles": [
            {"id":1, "name": "Test 1", "category_id": "1", "html": "<b>Banken, die die auf internationaler Ebene hat</b> der Ausschuss eine Reihe einheitlicher Kennzahlen entwickelt, dies als das Minimum hinaus betreffen. Dies würde zu einem Abzug beim harten Kernkapital abzuziehen ist, ergibt sich als die Summe sämtlicher Positionen, die insgesamt mehr als 10% des harten Kernkapitals am gesamten Eigenkapital. Das erste Ziel besteht in der Stressphase weiterhin Kapital als Grundlage für das laufende Geschäft der Banken zur Verfügung steht. Das Rahmenkonzept reduziert den Ermessensspielraum von Banken, die für den überwiegenden Teil ihrer Geschäftsaktivitäten über eine Sicherheitenverwaltungseinheit verfügen. Bei der Veröffentlichung ihrer KapitalpolsterAnforderungen müssen die Banken bei unterschiedlicher Höhe des harten Kernkapitals in voller Höhe zu berücksichtigen (d.h. Derartige zum Ausgleich herangezogene Vermögenswerte sollten mit dem prozentualen Anteil der Positionen des harten Kernkapitals in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Bewertung von wesentlichen Beteiligungen am Kapital von Bank-, Finanz- und Versicherungsinstituten, die ausserhalb des aufsichtsrechtlichen Konsolidierungskreises liegen, einbezogen wurde. Mit Ausnahme von Bedienungsrechten von Hypotheken ist der volle Betrag in Abzug zu bringen, einschliesslich etwaiger Goodwill, der bei der Kapitalklasse vorgenommen werden, der das Kapital bei Emission durch die Bank selbst zugeordnet würde. Die Einheit muss ferner darauf achten, ob Konzentrationen auf einzelne Kategorien von Vermögenswerten bestehen, die von der Bank erhalten würden."},
            {"id":2, "name": "Test 2", "category_id": "1", "html": "dfasdf"},
            {"id":3, "name": "Test 3", "category_id": "1", "html": "asdfas fdasf"},
            {"id":4, "name": "Test 4", "category_id": "1", "html": "sadf asfdasf asdf"},
            {"id":5, "name": "Derartige zum Ausgleich", "category_id": "2", "html": "sadf asfdasf asdf"},
            {"id":6, "name": "der bei der Kapitalklasse vorgenommen werden", "category_id": "3", "html": "sadf asfdasf asdf"},
        ],
        "favorites_last_id": "1",
        "favorites": [
            {"id":1, "article_id":"1"},
        ],
        "tags_last_id": "4",
        "tags": [
            {"id":1, "name":"computer"},
            {"id":2, "name":"testing"},
            {"id":3, "name":"development"},
            {"id":4, "name":"lorem"},
        ],
        "tags_relataions_last_id": "1",
        "tags_relations": [
            {"id":1, "tag_id":"1", "article_id":"1"},
        ]
    }

    static {
        Database.oDatabase = Database.oDefaultDatabase
    }

    // NOTE: Константы
    static DATABASE_PATH = "notes-database.json"
    static DATABASE_UPDATE_TIMEOUT = 30000

    static SHA = ""
    static sFilePath = ''
    
    // NOTE: Базовые объекты
    /** @var Octokit octokit */
    static octokit = null

    // NOTE: Переменные - Данные
    static sLogin = ''
    static sRepo = ''
    static sAPIKey = ''

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
        Database.aReposList = Database.aReposList || []
        _l(">>", {aArgs:arguments})
        if (iRepoIndex==-1) {
            Database.aReposList.push(oItem)
        } else {
            Database.aReposList.splice(iRepoIndex, 1, [oItem])
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
            emitter.emit('database-repos-selected')
            emitter.emit('database-repos-save')
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
        emitter.on('app-created', Database.fnFirstLoadDatabase)
        emitter.on('database-repos-load', Database.fnLoadReposList)
        emitter.on('database-repos-save', Database.fnSaveReposList)
        emitter.on('database-repos-update', Database.fnUpdateRepo)
        emitter.on('database-repos-remove', Database.fnRemoveRepo)
        emitter.on('database-repos-add', Database.fnAddRepo)
        emitter.on('database-repos-select', Database.fnSelectRepo)
        emitter.on('database-repos-clean', Database.fnCleanRepo)
        emitter.on('database-load', Database.fnGetNotesDatabase)
        emitter.on('database-get-sha', Database.fnGetSHADatabase)
        emitter.on('database-save', Database.fnWriteNotesDatabase)

        // emitter.emit('database-repos-load')
    }

    // ===============================================================

    static fnFirstLoadDatabase()
    {
        _s('Database.fnFirstLoadDatabase')
        // return Database
        //     // Нужно получить SHA и данные
        //     .fnGetNotesDatabase()
        //     .then(() => {
        //         _s('Database.fnFirstLoadDatabase.then')
        //         emitter.emit('database-first-loaded')
        //     })
        //     .catch((...aAnsw) => {
        //         _s('Database.fnFirstLoadDatabase.catch')
        //         _l('Database.fnFirstLoadDatabase.catch', aAnsw)
        //         emitter.emit('database-first-error', aAnsw)
        //     })        
    }

    // ===============================================================

    static fnGetSHADatabase()
    {
        return new Promise((fnResolv, fnReject) => {
            if (!Database.SHA) {
                Database.octokit.rest.repos.getContent({
                    owner: Database.sLogin,
                    repo: Database.sRepo,
                    path: Database.DATABASE_PATH,
                })
                .then(({ data }) => {
                    Database.SHA = data.sha
                    fnResolv(Database.SHA)
                    emitter.emit('database-get-sha-success')
                })
                .catch((e) => {
                    fnReject(e)
                    emitter.emit('database-get-sha-error')
                })
            }
        })
    }

    static fnGetNotesDatabase()
    {
        _l([Database.sLogin, Database.sRepo, Database.DATABASE_PATH])
        return Database.octokit.rest.repos.getContent({
            owner: Database.sLogin,
            repo: Database.sRepo,
            path: Database.DATABASE_PATH,
        }).then(({ data }) => {
            _l('fnGetNotesDatabase', data)
            Database.oDatabase = JSON.parse(decode(data.content))
            Database.SHA = data.sha
            _l('fnGetNotesDatabase', Database.oDatabase)
            emitter.emit('database-loaded')
        }).catch(() => {
            emitter.emit('database-load-error', aAnsw)

            if (/Not Found/.test(aAnsw[0])) {
                emitter.emit('database-load-error-notfound', aAnsw)
                
                emitter.emit('database-save')
            } else {
                emitter.emit('database-load-error-github-exception', aAnsw)
            }
        })
    }

    static fnWriteNotesDatabase()
    {
        _s('Database.fnWriteNotesDatabase')
        _l('fnWriteNotesDatabase', Database.oDatabase);
        var sData = JSON.stringify(Database.oDatabase)
        return Database.octokit.rest.repos.createOrUpdateFileContents({
            owner: Database.sLogin,
            repo: Database.sRepo,
            path: Database.DATABASE_PATH,
            sha: Database.SHA,
            message: Database.fnGetUpdateMessage(),
            content: encode(sData)
        })
        .then(() => {
            emitter.emit('database-save-success')
        })
        .catch(() => {
            emitter.emit('database-save-error')
        })
    }

    /**
     * Автоматическое сохранение
     */
    static fnUpdateNoteDatabase()
    {
        // if (Database.bDirty) {
        //     Editor.fnPrepareEditorContents()
        //     Database.fnWriteNotesDatabase()
        // }
        // Database.fnGetSHADatabase()
        // setTimeout(Database.fnUpdateNoteDatabase, Database.DATABASE_UPDATE_TIMEOUT);
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

    static fnGetArticlePath(iID)
    {
        return `articles/${iID}.md`
    }

    static fnGetArticlePathURL(iID)
    {
        return `blob/main/articles/${iID}.md`
    }

    static fnGetUpdateMessage() {
        return "update: "+(new Date())
    }

    // ===============================================================

    static fnGetCurrentCategory()
    {
        return Database.oDatabase.categories.find((oI) => oI.id==ModeCatalogController.sCatalogCategoryID)
    }

    static fnGetCurrentArticle()
    {
        return Database.oDatabase.articles.find((oI) => oI.id==ModeCatalogController.sArticleID)
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