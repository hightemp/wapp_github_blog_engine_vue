<template>
<div>
    <div class="block-overlay"></div>

    <div id="modal-ask-api-key" class="modal show" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Данные репозитория</h5>
                </div>
                <div class="modal-body" style="height: 500px; overflow-y: scroll">
                    <template v-if="iEditIndex!=null">
                        <div class="modal-ask-api_list_buttons">
                            <div></div>
                            <button type="button" class="btn btn-danger"
                                @click="fnCancelRepo">Отмена</button>
                            <button type="button" class="btn btn-primary"
                                @click="fnSaveRepo">Сохранить</button>
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">Логин</label>
                            <input type="text" class="form-control is-empty" v-model="sFormLogin">
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">Репозиторий</label>
                            <input type="text" class="form-control" v-model="sFormRepo">
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">API Ключ</label>
                            <input type="text" class="form-control" v-model="sFormKey">
                        </div>
                    </template>
                    <template v-else>
                        <div class="modal-ask-api_list_buttons">
                            <div></div>
                            <button class="btn btn-danger" @click="fnCleanRepo">Очистить</button>

                            <button class="btn btn-success" @click="fnNewRepo">Добавить</button>
                        </div>
                        <div v-for="(oItem, iIndex) in aList" v-key="iIndex" :class="'list-repo-item '+(iSelectedRepoIndex==iIndex ? 'active' : '')">
                            <template v-if="oItem">
                                <div class="list-repo-item_desc">
                                    <div><b>login:</b> {{oItem.login}}</div>
                                    <div><b>repo:</b> {{oItem.repo}}</div>
                                    <div><b>key:</b> {{oItem.key}}</div>
                                </div>
                                <div>
                                    <button class="btn btn-success" @click="fnEditRepo(iIndex)" title="Редактировать"><i class="bi bi-pencil"></i></button>
                                    <button class="btn btn-danger" @click="fnRemoveRepo(iIndex)" title="Удалить"><i class="bi bi-trash"></i></button>
                                    <button class="btn btn-info" @click="fnSelectRepo(iIndex)" title="Выбрать"><i class="bi bi-star-fill"></i></button>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" @click="fnAcceptRepo()">Выбрать</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

import { emitter } from "../../EventBus"

export default {
    name: 'AskAPIWindow',

    components: {

    },

    data() {
        return {
            iEditIndex: null,
            iSelectedRepoIndex: null,
            sFormLogin: "",
            sFormRepo: "",
            sFormKey: "",
            aList: []
            /**
             * { "login": "", "repo": "", "key": "" }
             */
        }
    },
    methods: {
        fnSaveRepo() {
            var oObj = {
                "login": this.sFormLogin, 
                "repo": this.sFormRepo, 
                "key": this.sFormKey
            }
            emitter.emit('database-repos-update', this.iEditIndex, oObj)
            this.iEditIndex = null
        },
        fnNewRepo() {
            this.iEditIndex = -1
            this.sFormLogin = ""
            this.sFormRepo = ""
            this.sFormKey = ""
        },
        fnEditRepo(iIndex) {
            _l("fnEditRepo", iIndex)
            this.iEditIndex = iIndex
            this.sFormLogin = this.aList[this.iEditIndex].login
            this.sFormRepo = this.aList[this.iEditIndex].repo
            this.sFormKey = this.aList[this.iEditIndex].key
        },
        fnRemoveRepo(iIndex) {
            emitter.emit('database-repos-remove', iIndex)
        },
        fnSelectRepo(iIndex) {
            emitter.emit('database-repos-select', iIndex)
        },
        fnCleanRepo() {
            emitter.emit('database-repos-clean')
        },
        fnCancelRepo() {
            this.iEditIndex = null
        },
        fnAcceptRepo() {
            emitter.once('database-repos-loaded', ({aList, iSelectedRepoIndex}) => {
                if (!aList[iSelectedRepoIndex]) {
                    alert('Не выбрано');
                } else {
                    emitter.emit('database-repos-select', iSelectedRepoIndex)
                    emitter.emit('repo-window-close')
                }
            })
            emitter.emit('database-repos-load')
        }
    },
    created()
    {
        var oThis = this

        emitter.on('database-repos-loaded', ({aList, iSelectedRepoIndex}) => {
            oThis.aList = aList
            oThis.iSelectedRepoIndex = iSelectedRepoIndex
            _l('>>>loaded', {aList, o:oThis.aList})
        })

        emitter.on('database-repos-saved', () => {
            emitter.emit('database-repos-load')
        })

        emitter.emit('database-repos-load')
    }
}
</script>

<style>

</style>