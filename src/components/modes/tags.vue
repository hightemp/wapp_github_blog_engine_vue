<template>
<div id="mode-tags" class="mode">
    <div class="tags-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" v-model="sTagFilter">
            <Dropdown :items="aTagDropdownMenu" @clickitem="fnTagClickItem" />
        </div>
        <div class="list">
            <template v-for="oI in aTagsList" :key="oI.id">
                <div :class="'input-group item-row '+(oI.id == sSelectedTagID ? 'active' : '')" @click="fnSelectTag(oI.id)">
                    <a 
                        :class="'list-group-item list-group-item-action item-title '" 
                    >
                        <div class="item-inner-title">{{oI.name}}</div>
                    </a>
                </div>
            </template>
        </div>
    </div>
    <div class="tags-articles-panel">
        <div class="actions-panel">
            <input type="text" class="form-control"  v-model="sArticleFilter">
            <!--Dropdown :items="aArticleDropdownMenu" /-->
        </div>
        <div class="list">
            <template v-for="oI in aArticlesList" :key="oI.id">
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
    name: 'TagsMode',

    components: {
        Dropdown
    },

    computed: {
        ...mapState(a`sSelectedTagID sSelectedArticleID`),
        ...mapGetters(a`oCurrentTag`),
        aTagsList() {
            return this.$store.getters.fnFilterTags(this.sTagFilter)
        },
        aArticlesList() {
            return this.$store.getters.fnFilterCurrentTagsArticles(this.sArticleFilter)
        }
    },

    data() {
        return {
            sTagFilter: "",
            sArticleFilter: "",

            aTagDropdownMenu: [
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
        ...mapMutations(a`fnSelectTag fnShowTagEditWindow fnRemoveTag`),
        ...mapActions(a`fnSelectArticle`),
        fnTagClickItem(oI) {
            if (oI.id == "add") {
                this.fnShowTagEditWindow(null)
            }
            if (oI.id == "edit") {
                if (!this.oCurrentTag) {
                    alert('Нужно выбрать');
                } else {
                    this.fnShowTagEditWindow(this.oCurrentTag)
                }
            }
            if (oI.id == "delete") {
                if (!this.oCurrentTag) {
                    alert('Нужно выбрать');
                } else {
                    this.fnRemoveTag(this.oCurrentTag)
                }
            }
        },
    },
}
</script>

<style>

</style>