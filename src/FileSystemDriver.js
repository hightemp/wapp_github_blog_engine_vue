import { Octokit } from "@octokit/rest"
import { createClient } from "webdav/web"
import { encode, decode } from 'js-base64'

import { emitter } from './EventBus'

export class FileSystemDriver {
    static oDatabase = {}

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
                var sData = await FileSystemDriver.webdav.getFileContents(FileSystemDriver.DATABASE_PATH)
                FileSystemDriver.oDatabase = JSON.parse(decode(sData))
            } catch (oE) {
                _l(oE)
                emitter.emit('database-db-load-error', oE+'')
    
                if (/Not Found/.test(oE+'')) {
                    emitter.emit('database-db-load-error-notfound', oE+'')
    
                    emitter.emit('database-db-save')
                } else {
                    emitter.emit('database-db-load-error-github-exception', aAnsw)
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
            emitter.emit('database-db-load-error', aAnsw)

            if (/Not Found/.test(aAnsw[0])) {
                emitter.emit('database-db-load-error-notfound', aAnsw)

                emitter.emit('database-db-save')
            } else {
                emitter.emit('database-db-load-error-github-exception', aAnsw)
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
            emitter.emit('database-db-save-error', aArgs)
        })
    }

    static fnWriteDatabaseWebdav()
    {
        var sData = JSON.stringify(FileSystemDriver.oDatabase, null, 4)
        var oR = FileSystemDriver.oRepoItem

        return new Promise(async (fnResolv, fnReject) => {
            await FileSystemDriver.webdav.putFileContents(FileSystemDriver.DATABASE_PATH, sData)
        }).catch((...aAnsw) => {
            emitter.emit('database-db-load-error', aAnsw)

            if (/Not Found/.test(aAnsw[0])) {
                emitter.emit('database-db-load-error-notfound', aAnsw)

                emitter.emit('database-db-save')
            } else {
                emitter.emit('database-db-load-error-github-exception', aAnsw)
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