<template>
<div v-show="bShowWindow">
    <div class="block-overlay"></div>
    <div class="modal show" id="modal-edit-category" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">Редактирование категории</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="fnClose"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="" class="form-label">Родительская группа</label>
                        <div>
                            <select id="edit-category-group" class="form-control box1" aria-describedby=""  v-model="sCategoryGroup">
                                <option v-for="oGroup in aAllGroupsList" :key="oGroup.id" :value="oGroup.id">{{oGroup.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="" class="form-label">Родительская категория</label>
                        <div>
                            <select id="edit-category-parent" class="form-control box1" aria-describedby="" v-model="sCategoryParent">
                                <option v-for="oCategory in aCategoriesList" :key="oCategory.id" :value="oCategory.id">{{oCategory.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="" class="form-label">Название</label>
                        <input type="text" class="form-control" id="edit-category-name" aria-describedby="" v-model="sCategoryName">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="fnClose">Отмена</button>
                    <button id="category-edit-save" type="button" class="btn btn-success" @click="fnSave">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { emitter } from "../../EventBus"

export default {
    name: "EditCategory",

    props: {},

    data() {
        return {
            bShowWindow: false,

            oItem: null,

            sCategoryName: "",

            sCategoryGroup: null,
            sCategoryParent: null,

            aAllGroupsList: [],
            aCategoriesList: [],

        }
    },

    watch: {

    },

    methods: {
        fnClose() {
            var oThis = this
            oThis.bShowWindow = false
        },
        fnSave() {
            var oThis = this

            emitter.once('database-catalog-category-saved', () => {
                oThis.fnClose()
                emitter.emit('database-catalog-category-list-filter-reload')
            })

            if (oThis.oItem) {
                emitter.emit('database-catalog-category-update', {
                    ...oThis.oItem,
                    name: oThis.sGroupName
                })
            } else {
                emitter.emit('database-catalog-category-add', {
                    name: oThis.sGroupName
                })
            }
        }
    },

    created() {
        var oThis = this

        emitter.on('database-catalog-category-group-list-loaded', ({ aList }) => {
            oThis.aAllGroupsList = aList
        })

        emitter.on('database-catalog-category-for-group-list-loaded', ({ aList }) => {
            oThis.aCategoriesList = aList
        })

        emitter.on('category-window-show', (oI) => {
            oThis.oItem = oI

            if (oThis.oItem) {
                oThis.sGroupName = oThis.oItem.name
                oThis.sCategoryGroup = oThis.oItem.group_id
                oThis.sCategoryParent = oThis.oItem.parent_id
                _l([oThis.sCategoryGroup, oThis.sCategoryParent])
            } else {
                oThis.sGroupName = ""
                oThis.sCategoryGroup = ""
                oThis.sCategoryParent = ""
            }

            emitter.emit('database-catalog-category-group-list')
            emitter.emit('database-catalog-category-for-group-list', oThis.sCategoryGroup)

            oThis.bShowWindow = true
        })
        emitter.on('category-window-close', () => {
            oThis.bShowWindow = false
        })
    }
}
</script>

<style>

</style>