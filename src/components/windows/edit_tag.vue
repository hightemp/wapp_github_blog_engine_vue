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
    name: "EditGroup",

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

            emitter.once('database-tag-saved', () => {
                oThis.fnClose()
                emitter.emit('database-tag-list-filter-reload')
            })

            if (oThis.oItem) {
                emitter.emit('database-tag-update', {
                    ...oThis.oItem,
                    name: oThis.sName
                })
            } else {
                emitter.emit('database-tag-add', {
                    name: oThis.sName
                })
            }
        }
    },

    created() {
        var oThis = this

        emitter.on('tag-window-show', (oI) => {
            oThis.oItem = oI

            if (oThis.oItem) {
                oThis.sName = oThis.oItem.name
            } else {
                oThis.sName = null
            }

            oThis.bShowWindow = true
        })
        emitter.on('tag-window-close', () => {
            oThis.bShowWindow = false
        })
    }
}
</script>

<style>

</style>