<template>
<div id="mode-catalog" class="mode">
    <div class="groups-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" v-model="sGroupGilter">
            <Dropdown :items="aGroupDropdownMenu" @clickitem="fnGroupClickItem" />
        </div>
        <div class="list">
            <template v-for="oI in aGroupList" :key="oI.id">
                <div :class="'input-group item-row '+(oI.id == sSelectedGroupID ? 'active' : '')" @click="fnSelectGroup(oI.id)">
                    <!-- <div class="input-group-text">
                        <input class="form-check-input mt-0 cb-groups" type="checkbox"/>
                    </div> -->
                    <a 
                        :class="'list-group-item list-group-item-action item-title '" 
                    >
                        <div class="item-inner-title">{{oI.name}}</div>
                    </a>
                </div>
            </template>
        </div>
    </div>
    <div class="categories-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" v-model="sCategoryFilter">
            <Dropdown :items="aCategoryDropdownMenu" @clickitem="fnCategoryClickItem"/>
        </div>
        <div class="list">
            <TreeList 
                :list="aCategoryList" 
                :parent="0"
                :level="0"
                :selected="sSelectedCategoryID"
                @clickitem="fnSelectCategoryItem"
            />
        </div>
    </div>
    <div class="articles-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" v-model="sArticleFilter">
            <Dropdown :items="aArticleDropdownMenu" @clickitem="fnArticleClickItem"/>
        </div>
        <div class="list">
            <template v-for="(oI, iI) in aArticleList" :key="iI">
                <div :class="'input-group item-row '+(oI.id == sSelectedArticleID ? 'active' : '')" @click="fnSelectArticle(oI.id)">
                    <!-- <div class="input-group-text">
                        <input class="form-check-input mt-0 cb-groups" type="checkbox"/>
                    </div> -->
                    <a 
                        :class="'list-group-item list-group-item-action item-title '" 
                    >
                        <div class="item-inner-title">{{oI.name}}</div>
                    </a>
                </div>
            </template>
        </div>
    </div>
</div>
</template>

<script>

import TreeList from "../tree/list.vue"

import Dropdown from "../dropdown.vue"

import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a } from "../../lib"


export default {
    name: 'CatalogMode',

    components: {
        Dropdown,
        TreeList
    },

    computed: {
        ...mapState(a`sSelectedGroupID sSelectedCategoryID sSelectedArticleID`),
        ...mapGetters(a`oCurrentGroup oCurrentCategory oCurrentArticle`),
        aGroupList() {
            return this.$store.getters.fnFilterGroups(this.sGroupGilter)
        },
        aCategoryList() {
            return this.$store.getters.fnFilterCurrentCategories(this.sCategoryFilter)
        },
        aArticleList() {
            return this.$store.getters.fnFilterCurrentArticles(this.sArticleFilter)
        }
    },

    data() {
        return {
            sGroupGilter: "",
            sCategoryFilter: "",
            sArticleFilter: "",

            aGroupDropdownMenu: [
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
            ],
            aCategoryDropdownMenu: [
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
            ],
            aArticleDropdownMenu: [
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
                { id:"favorites", title:'<i class="bi bi-star-fill"></i> В избранное' },
            ]
        }
    },

    methods: {
        ...mapMutations(a`fnSelectGroup fnSelectCategory fnShowGroupEditWindow fnShowCategoryEditWindow fnShowArticleEditWindow fnRemoveGroup fnRemoveCategory fnRemoveArticle fnAddFavorite`),
        ...mapActions(a`fnSelectArticle`),

        fnSelectCategoryItem(oI) {
            this.fnSelectCategory(oI.id)
        },
        fnGroupClickItem(oI) {
            if (oI.id == "add") {
                this.fnShowGroupEditWindow(null)
            }
            if (oI.id == "edit") {
                if (!this.oCurrentGroup) {
                    alert('Нужно выбрать');
                } else {
                    this.fnShowGroupEditWindow(this.oCurrentGroup)
                }
            }
            if (oI.id == "delete") {
                if (!this.oCurrentGroup) {
                    alert('Нужно выбрать');
                } else {
                    this.fnRemoveGroup(this.oCurrentGroup)
                }
            }
        },
        fnCategoryClickItem(oI) {
            if (oI.id == "add") {
                this.fnShowCategoryEditWindow(null)
            }
            if (oI.id == "edit") {
                if (!this.oCurrentCategory) {
                    alert('Нужно выбрать');
                } else {
                    this.fnShowCategoryEditWindow(this.oCurrentCategory)
                }
            }
            if (oI.id == "delete") {
                if (!this.oCurrentCategory) {
                    alert('Нужно выбрать');
                } else {
                    this.fnRemoveCategory(this.oCurrentCategory)
                }
            }
        },
        fnArticleClickItem(oI) {
            if (oI.id == "add") {
                this.fnShowArticleEditWindow(null)
            }
            if (oI.id == "edit") {
                if (!this.oCurrentArticle) {
                    alert('Нужно выбрать');
                } else {
                    this.fnShowArticleEditWindow(this.oCurrentArticle)
                }
            }
            if (oI.id == "delete") {
                if (!this.oCurrentArticle) {
                    alert('Нужно выбрать');
                } else {
                    this.fnRemoveArticle(this.oCurrentArticle)
                }
            }
            if (oI.id == "favorites") {
                if (!this.oCurrentArticle) {
                    alert('Нужно выбрать');
                } else {
                    this.fnAddFavorite(this.oCurrentArticle)
                }
            }
        },
    },

    created() {
        var oThis = this
        
    }
}
</script>

<style>

</style>