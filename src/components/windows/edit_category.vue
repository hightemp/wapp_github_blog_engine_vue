<template>
<div v-show="bShowCategoryEditWindow">
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
                            <select id="edit-category-group" class="form-control box1" aria-describedby=""  v-model="sCategoryEditWindowGroupID">
                                <option v-for="oGroup in aGroupsList" :key="oGroup.id" :value="oGroup.id">{{oGroup.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="" class="form-label">Родительская категория</label>
                        <div>
                            <select id="edit-category-parent" class="form-control box1" aria-describedby="" v-model="sCategoryEditWindowCategoryID">
                                <option v-for="oCategory in aCategoriesList" :key="oCategory.id" :value="oCategory.id">{{oCategory.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="" class="form-label">Название</label>
                        <input type="text" class="form-control" id="edit-category-name" aria-describedby="" v-model="sCategoryEditWindowCategoryName">
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
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a, cc } from "../../lib"

export default {
    name: "EditCategory",

    props: {},

    computed: {
        ...mapState(a`bShowCategoryEditWindow`),
        ...mapGetters(a`aGroupsList`),
        ...cc(`sCategoryEditWindowCategoryName sCategoryEditWindowGroupID sCategoryEditWindowCategoryID`),
        aCategoriesList() {
            return this.$store.getters.fnFilterCategoriesByGroup(this.sCategoryEditWindowGroupID)
        },
    },

    data() {
        return {
        }
    },

    methods: {
        ...mapMutations(a`fnHideCategoryEditWindow`),
        ...mapActions(a`fnSaveCategory`),
        fnSave() {
            this.fnSaveCategory()
            this.fnHideCategoryEditWindow()
        },
        fnClose() {
            this.fnHideCategoryEditWindow()
        }
    },
}
</script>

<style>

</style>