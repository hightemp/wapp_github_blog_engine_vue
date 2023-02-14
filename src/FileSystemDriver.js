import { Octokit } from "@octokit/rest"
import { createClient } from "webdav/web"
import { encode, decode } from 'js-base64'

export class FileSystemDriver {
    /** @var Octokit octokit */
    static octokit = null
    static oSHA = {}

    /** @var WebDAVClient webdav */
    static webdav = null

    static oRepoItem = null

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
    
    static fnReadFileJSON(sFilePath)
    {
        return new Promise(async (fnResolv, fnReject) => {
            this.fnReadFile(sFilePath)
                .then(({ sData }) => {
                    fnResolv(JSON.parse(sData))
                })
                .catch((oE) => { fnReject(oE) })
        })
    }

    static fnReadFile(sFilePath)
    {
        if (FileSystemDriver.oRepoItem.type == "github") {
            return FileSystemDriver.fnReadFileGithub(sFilePath)
        }
        if (FileSystemDriver.oRepoItem.type == "webdav") {
            return FileSystemDriver.fnReadFileWebdav(sFilePath)
        }
    }

    static fnWriteFileJSON(sFilePath, mData)
    {
        return this.fnWriteFile(sFilePath, JSON.stringify(mData, null, 4))
    }

    static fnWriteFile(sFilePath, sData)
    {
        if (FileSystemDriver.oRepoItem.type == "github") {
            return FileSystemDriver.fnWriteFileGithub(sFilePath, sData)
        }
        if (FileSystemDriver.oRepoItem.type == "webdav") {
            return FileSystemDriver.fnWriteFileWebdav(sFilePath, sData)
        }
    }

    static fnCreateDir(sFilePath)
    {
        if (FileSystemDriver.oRepoItem.type == "webdav") {
            return FileSystemDriver.fnCreateDirWebdav(sFilePath)
        }
    }

    // ===============================================================

    static fnCreateDirWebdav(sFilePath)
    {
        return new Promise(async (fnResolv, fnReject) => {
            _l(">>>", sFilePath)
            FileSystemDriver.webdav.createDirectory(sFilePath)
            fnResolv();
        })
    }

    static fnReadFileWebdav(sFilePath)
    {
        var oR = FileSystemDriver.oRepoItem

        return new Promise(async (fnResolv, fnReject) => {
            try {
                var oData = (await FileSystemDriver.webdav.getFileContents(sFilePath))
                var enc = new TextDecoder("utf-8");
                var sData = enc.decode(oData)
                FileSystemDriver.oSHA[sFilePath] = ""
                fnResolv({ sData, sSHA:"" })
            } catch (oE) {
                console.error(oE)
                fnReject(oE)
            }
        })
    }

    static fnReadFileGithub(sFilePath)
    {
        return new Promise(async (fnResolv, fnReject) => {
            var oR = FileSystemDriver.oRepoItem
            sFilePath = sFilePath.replace(/^\/+/, '')
            return FileSystemDriver.octokit.rest.repos.getContent({
                owner: oR.login,
                repo: oR.repo,
                path: sFilePath,
            }).then(({ data }) => {
                console.log(data)
                var sData = decode(data.content)
                FileSystemDriver.oSHA[sFilePath] = data.sha
                console.log(FileSystemDriver.oSHA)
                fnResolv({sData, sSHA: data.sha})
            }).catch((oE) => {
                console.error(oE)
                fnReject(oE)
            })
        })
    }

    static fnWriteFileGithub(sFilePath, sData, sSHA=null)
    {
        return new Promise(async (fnResolv, fnReject) => {
            var oR = FileSystemDriver.oRepoItem
            sFilePath = sFilePath.replace(/^\/+/, '')
            return FileSystemDriver.octokit.rest.repos.createOrUpdateFileContents({
                owner: oR.login,
                repo: oR.repo,
                path: sFilePath,
                sha: sSHA ? sSHA : FileSystemDriver.oSHA[sFilePath],
                message: FileSystemDriver.fnGetUpdateMessage(),
                content: encode(sData)
            })
            .then((oData) => {
                // FileSystemDriver.oSHA[sFilePath] = oData.data.content.sha
                console.log(oData)
                fnResolv()
            })
            .catch((oE) => {
                console.error(oE)
                fnReject(oE)
            })
        })
    }

    static fnWriteFileWebdav(sFilePath, sData)
    {
        return new Promise(async (fnResolv, fnReject) => {
            var oR = FileSystemDriver.oRepoItem

            return new Promise(async (fnResolv, fnReject) => {
                try {
                    var enc = new TextEncoder()
                    var aData = enc.encode(sData)
                    await FileSystemDriver.webdav.putFileContents(
                        sFilePath, 
                        aData,
                        { contentLength: false, overwrite: true }
                    )

                    fnResolv()
                } catch (oE) {
                    fnReject(oE)
                }
            })
        })
    }

    static fnGetUpdateMessage() {
        return "update: "+(new Date())
    }
}