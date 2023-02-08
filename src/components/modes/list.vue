<template>
<div id="mode-list" class="mode">
    <div class="all-articles-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sFilter">
            <Dropdown :items="aDropdownMenu" @clickitem="fnMenuItemClick" />
        </div>
        <div class="list">
            <template v-for="oI in aArticleList" :key="oI.id">
                <div :class="'input-group item-row item-artilces-list '+(oI.id == sSelectedArticleID ? 'active' : '')" @click="fnSelectArticle(oI.id)">
                    <a 
                        :class="'list-group-item list-group-item-action item-title '" 
                    >
                        <div class="item-inner-title">{{oI.name}}</div>
                    </a>
                    <div class="item-inner-title">{{fnGetCategory(oI.category_id)?.name}}</div>
                </div>
            </template>
        </div>
    </div>
</div>
</template>

<script>

import { Database } from "../../Database"

import Dropdown from "../dropdown.vue"

import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a } from "../../lib"

export default {
    name: 'ListMode',

    components: {
        Dropdown
    },

    computed: {
        ...mapState(a`sSelectedArticleID`),
        ...mapGetters(a`oCurrentArticle fnGetCategory`), 
        aArticleList() {
            return this.$store.getters.fnFilterArticles(this.sFilter)
        },       
    },

    data() {
        return {
            sFilter: "",

            aDropdownMenu: [
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
                { id:"favorites", title:'<i class="bi bi-star-fill"></i> В избранное' },
            ]
        }
    },

    methods: {
        ...mapMutations(a`fnSelectArticle fnShowArticleEditWindow`),
        ...mapActions(a`fnRemoveArticle`),
        fnMenuItemClick(oI)
        {
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
        }
    },
}
</script>

<style>

</style>