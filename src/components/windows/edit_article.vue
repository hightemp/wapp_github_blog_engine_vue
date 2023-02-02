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
                        <input type="text" class="form-control" id="edit-category-name" aria-describedby="" v-model="sArticleName">
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

            sArticleName: "",

            sCategoryGroup: null,
            sCategoryParent: null,

            aAllGroupsList: [],
            aCategoriesList: [],

        }
    },

    watch: {
        sCategoryGroup(sNew, sOld) {
            emitter.emit('database-catalog-category-for-group-list', sNew)
        }
    },

    methods: {
        fnClose() {
            var oThis = this
            oThis.bShowWindow = false
        },
        fnSave() {
            var oThis = this

            emitter.once('database-article-saved', () => {
                oThis.fnClose()
                emitter.emit('database-catalog-article-list-filter-reload')
            })

            if (oThis.oItem) {
                emitter.emit('database-article-update', {
                    ...oThis.oItem,
                    category_id: oThis.sCategoryParent,
                    name: oThis.sArticleName
                })
            } else {
                emitter.emit('database-article-add', {
                    category_id: oThis.sCategoryParent,
                    name: oThis.sArticleName
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
            oThis.aCategoriesList = [{id:null, name:'<Нет>'}].concat(aList)
        })

        emitter.on('article-window-show', (oCurrentArticle, oCategory, oGroup) => {
            oThis.oItem = oCurrentArticle

            // if (!oCategory) {
            //     alert('Нужно выбрать группу')
            //     return
            // }

            if (oThis.oItem) {
                oThis.sArticleName = oThis.oItem.name
                oThis.sCategoryGroup = oGroup ? oGroup.id : null
                oThis.sCategoryParent = oThis.oItem.category_id
            } else {
                oThis.sArticleName = ""
                oThis.sCategoryGroup = oGroup ? oGroup.id : null
                oThis.sCategoryParent = oCategory ? oCategory.id : null
            }

            emitter.emit('database-catalog-category-group-list')
            emitter.emit('database-catalog-category-for-group-list', oThis.sCategoryGroup)

            oThis.bShowWindow = true
        })
        emitter.on('article-window-close', () => {
            oThis.bShowWindow = false
        })
    }
}
</script>

<style>

</style>