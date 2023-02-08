<template>
<div v-show="bShowArticleEditWindow">
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
                            <select id="edit-category-group" class="form-control box1" aria-describedby=""  v-model="sArticleEditWindowGroupID">
                                <option v-for="oGroup in aGroupsList" :key="oGroup.id" :value="oGroup.id">{{oGroup.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="" class="form-label">Родительская категория</label>
                        <div>
                            <select id="edit-category-parent" class="form-control box1" aria-describedby="" v-model="sArticleEditWindowCategoryID">
                                <option v-for="oCategory in aCategoriesList" :key="oCategory.id" :value="oCategory.id">{{oCategory.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="" class="form-label">Название</label>
                        <input type="text" class="form-control" id="edit-category-name" aria-describedby="" v-model="sArticleEditWindowArticleName">
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
    name: "EditArticle",

    props: {},

    computed: {
        ...mapState(a`bShowArticleEditWindow`),
        ...mapGetters(a`aGroupsList fnFilterCategoriesByGroup`),
        ...cc(`sArticleEditWindowArticleName sArticleEditWindowGroupID sArticleEditWindowCategoryID`),
        aCategoriesList() { return this.$store.getters.fnFilterCategoriesByGroup(this.sArticleEditWindowGroupID) }
    },

    data() {
        return {
            bShowWindow: false,
        }
    },

    methods: {
        ...mapMutations(a`fnHideArticleEditWindow`),
        ...mapActions(a`fnSaveArticle`),
        fnSave() {
            this.fnSaveArticle()
            this.fnHideArticleEditWindow()
        },
        fnClose() {
            this.fnHideArticleEditWindow()
        }
    },
}
</script>

<style>

</style>