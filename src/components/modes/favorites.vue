<template>
<div id="mode-favorites" class="mode">
    <div class="favorites-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" v-model="sFavFilter">
            <Dropdown :items="aDropdownMenu" clickitem="fnArticleClickItem" />
        </div>
        <div class="list">
            <template v-for="oI in aFavList" :key="oI.id">
                <div :class="'input-group item-row '+(oI.id == sSelectedArticleID ? 'active' : '')" @click="fnSelectArticle(oI.id)">
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

import Dropdown from "../dropdown.vue"

import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a } from "../../lib"

export default {
    name: 'FavoritesMode',

    components: {
        Dropdown
    },

    computed: {
        ...mapState(a`sSelectedArticleID oDatabase`),
        ...mapGetters(a`oCurrentArticle fnGetCategory`), 
        aFavList() {
            return this.$store.state.oDatabase.favorites.map((oI) => this.$store.state.oDatabase.articles.find((oAI) => oAI.id == oI.article_id)).filter((oI) => ~oI.name.indexOf(this.sFavFilter))
        },
    },

    data() {
        return {
            sFavFilter: "",

            aDropdownMenu: [
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
                { id:"favorites", title:'<i class="bi bi-star-fill"></i> Убрать из ибранного' },
            ],
        }
    },

    methods: {
        ...mapMutations(a`fnShowArticleEditWindow fnRemoveArticle`),
        ...mapActions(a`fnSelectArticle`),
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
                    this.fnRemoveFavorite(this.oCurrentArticle)
                }
            }
        },
    },
}
</script>

<style>

</style>