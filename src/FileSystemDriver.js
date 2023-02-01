import { Octokit } from "@octokit/rest"
import { createClient } from "webdav/web"
import { encode, decode } from 'js-base64'

import { emitter } from './EventBus'

export class FileSystemDriver {
    static oDatabase = {
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

    /** @var Octokit octokit */
    static octokit = null
    static SHA = ""

    /** @var WebDAVClient webdav */
    static webdav = null

    static oRepoItem = null

    // NOTE: Константы
    static DATABASE_PATH = "notes-database.json"
    static DATABASE_UPDATE_TIMEOUT = 30000

    // ===============================================================

    static fnInit(oRepoItem)
    {
        FileSystemDriver.oRepoItem = oRepoItem

        if (oRepoItem.type == "github") {
            FileSystemDriver.fnInitGit()
        }
        if (oRepoItem.type == "webdav") {
            FileSystemDriver.fnInitWebdav()
        }
    }

    static fnInitGit()
    {
        _s('Database.fnInitGit')
        FileSystemDriver.octokit = new Octokit({
            auth: FileSystemDriver.oRepoItem.key,
        });
    }

    static fnInitWebdav()
    {
        FileSystemDriver.webdav = createClient(
            FileSystemDriver.oRepoItem.url,
            {
                username: FileSystemDriver.oRepoItem.username,
                password: FileSystemDriver.oRepoItem.password
            }
        );
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

    static fnReadDatabase()
    {
        if (FileSystemDriver.oRepoItem.type == "github") {
            return FileSystemDriver.fnReadDatabaseGithub()
        }
        if (FileSystemDriver.oRepoItem.type == "webdav") {
            return FileSystemDriver.fnReadDatabaseWebdav()
        }
    }

    static fnWriteDatabase()
    {
        if (FileSystemDriver.oRepoItem.type == "github") {
            return FileSystemDriver.fnWriteDatabaseGithub()
        }
        if (FileSystemDriver.oRepoItem.type == "webdav") {
            return FileSystemDriver.fnWriteDatabaseWebdav()
        }
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

    static fnReadDatabaseWebdav()
    {
        var oR = FileSystemDriver.oRepoItem

        return new Promise(async (fnResolv, fnReject) => {
            try {
                var oData = (await FileSystemDriver.webdav.getFileContents(FileSystemDriver.DATABASE_PATH))
                var enc = new TextDecoder("utf-8");
                var sData = enc.decode(oData)
                _l('fnReadDatabaseWebdav', sData)
                FileSystemDriver.oDatabase = JSON.parse(sData)
                fnResolv(FileSystemDriver.oDatabase)
            } catch (oE) {
                _l(oE)
                emitter.emit('database-db-error', oE+'')
    
                if (/Not Found/.test(oE+'')) {
                    emitter.emit('database-db-load-error-notfound', oE+'')
    
                    emitter.emit('database-db-save')
                } else {
                    emitter.emit('database-db-load-error-github-exception', oE+'')
                }
            }
        })
    }

    static fnReadDatabaseGithub()
    {
        var oR = FileSystemDriver.oRepoItem
        return FileSystemDriver.octokit.rest.repos.getContent({
            owner: oR.login,
            repo: oR.repo,
            path: FileSystemDriver.DATABASE_PATH,
        }).then(({ data }) => {
            _l('fnGetNotesDatabase', data)
            FileSystemDriver.oDatabase = JSON.parse(decode(data.content))
            FileSystemDriver.SHA = data.sha
            emitter.emit('database-db-loaded')
            return FileSystemDriver.oDatabase
        }).catch((...aAnsw) => {
            emitter.emit('database-db-error', aArgs[0]+'')

            if (/Not Found/.test(aAnsw[0])) {
                emitter.emit('database-db-load-error-notfound', aArgs[0]+'')

                emitter.emit('database-db-save')
            } else {
                emitter.emit('database-db-load-error-github-exception', aArgs[0]+'')
            }
        })
    }

    static fnWriteDatabaseGithub()
    {
        _s('Database.fnWriteNotesDatabase')
        var sData = JSON.stringify(FileSystemDriver.oDatabase, null, 4)
        var oR = FileSystemDriver.oRepoItem
        return FileSystemDriver.octokit.rest.repos.createOrUpdateFileContents({
            owner: oR.sLogin,
            repo: oR.sRepo,
            path: FileSystemDriver.DATABASE_PATH,
            sha: FileSystemDriver.SHA,
            message: FileSystemDriver.fnGetUpdateMessage(),
            content: encode(sData)
        })
        .then(() => {
            emitter.emit('database-db-saved')
        })
        .catch((...aArgs) => {
            emitter.emit('database-db-error', aArgs[0]+'')
            emitter.emit('database-db-save-error', aArgs[0]+'')
        })
    }

    static fnWriteDatabaseWebdav()
    {
        var sData = JSON.stringify(FileSystemDriver.oDatabase, null, 4)
        var oR = FileSystemDriver.oRepoItem

        return new Promise(async (fnResolv, fnReject) => {
            try {
                var enc = new TextEncoder()
                var aData = enc.encode(sData)
                await FileSystemDriver.webdav.putFileContents(
                    FileSystemDriver.DATABASE_PATH, 
                    aData,
                    { contentLength: false, overwrite: true }
                )
                emitter.emit('database-db-saved')
            } catch (oE) {
                emitter.emit('database-db-error', oE+'')
                emitter.emit('database-db-save-error', oE+'')
    
                if (/Not Found/.test(oE+'')) {
                    emitter.emit('database-db-load-error-notfound', oE+'')
    
                    emitter.emit('database-db-save')
                } else {
                    emitter.emit('database-db-load-error-github-exception', oE+'')
                }
                throw oE
            }
        })
    }

    static fnGetUpdateMessage() {
        return "update: "+(new Date())
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
}