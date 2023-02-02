<template>
<div v-show="bShowWindow">
    <div class="block-overlay"></div>
    <div class="modal show" id="modal-edit-article" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">Статья</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="fnClose"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="" class="form-label">Название</label>
                        <input type="text" class="form-control"  aria-describedby="" v-model="sName">
                    </div>
                    <div class="mb-3">
                        <label for="" class="form-label">URL</label>
                        <input type="text" class="form-control"  aria-describedby="" v-model="sURL">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="fnClose">Отмена</button>
                    <button id="article-edit-save" type="button" class="btn btn-success" @click="fnSave">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

import { emitter } from "../../EventBus"

export default {
    name: "EditLink",

    props: {},

    data() {
        return {
            bShowWindow: false,

            oItem: null,

            sName: "",
        }
    },

    methods: {
        fnClose() {
            var oThis = this
            oThis.bShowWindow = false
        },
        fnSave() {
            var oThis = this

            emitter.once('database-link-saved', () => {
                oThis.fnClose()
                emitter.emit('database-link-list-filter-reload')
            })

            if (oThis.oItem) {
                emitter.emit('database-link-update', {
                    ...oThis.oItem,
                    name: oThis.sName,
                    url: oThis.sURL,
                })
            } else {
                emitter.emit('database-link-add', {
                    name: oThis.sName,
                    url: oThis.sURL,
                })
            }
        }
    },

    created() {
        var oThis = this

        emitter.on('link-window-show', (oI) => {
            oThis.oItem = oI

            if (oThis.oItem) {
                oThis.sName = oThis.oItem.name
                oThis.sURL = oThis.oItem.url
            } else {
                oThis.sName = ""
                oThis.sURL = ""
            }

            oThis.bShowWindow = true
        })
        emitter.on('link-window-close', () => {
            oThis.bShowWindow = false
        })
    }
}
</script>

<style>

</style>