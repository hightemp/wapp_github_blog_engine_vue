<template>
<div id="mode-catalog" class="mode">
    <div class="groups-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterGroup" v-model="sGroupGilter">
            <Dropdown :items="aGroupDropdownMenu" />
        </div>
        <div class="list">
            <template v-for="(oI, iI) in aGroupList" v-key="oI.id">
                <div :class="'input-group item-row '+(oI.id == sGroupSelectedID ? 'active' : '')" @click="fnSelectGroup(oI.id)">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0 cb-groups" type="checkbox"/>
                    </div>
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
            <input type="text" class="form-control" @input="fnFilterCategory" v-model="sCategoryFilter">
            <Dropdown :items="aCategoryDropdownMenu" />
        </div>
        <div class="list">
            <template v-for="(oI, iI) in aCategoryList" v-key="oI.id">
                <div :class="'input-group item-row '+(oI.id == sCategorySelectedID ? 'active' : '')" @click="fnSelectCategory(oI.id)">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0 cb-groups" type="checkbox"/>
                    </div>
                    <a 
                        :class="'list-group-item list-group-item-action item-title '" 
                    >
                        <div class="item-inner-title">{{oI.name}}</div>
                    </a>
                </div>
            </template>
        </div>
    </div>
    <div class="articles-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterArticle" v-model="sArticleFilter">
            <Dropdown :items="aArticleDropdownMenu" />
        </div>
        <div class="list">
            <template v-for="(oI, iI) in aArticleList" v-key="oI.id">
                <div :class="'input-group item-row '+(oI.id == sArticleSelectedID ? 'active' : '')" @click="fnSelectArticle(oI.id)">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0 cb-groups" type="checkbox"/>
                    </div>
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

import { emitter } from "../../EventBus"

export default {
    name: 'CatalogMode',

    components: {
        Dropdown
    },

    data() {
        return {
            aGroupList: [],
            aCategoryList: [],
            aArticleList: [],

            sGroupSelectedID: null,
            sCategorySelectedID: null,
            sArticleSelectedID: null,

            sGroupGilter: "",
            sCategoryFilter: "",
            sArticleFilter: "",

            aGroupDropdownMenu: [
                { id:"reload", title:'<i class="bi bi-arrow-repeat"></i> Обновить' },
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
            ],
            aCategoryDropdownMenu: [
                { id:"reload", title:'<i class="bi bi-arrow-repeat"></i> Обновить' },
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
            ],
            aArticleDropdownMenu: [
                { id:"reload", title:'<i class="bi bi-arrow-repeat"></i> Обновить' },
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
                { id:"favorites", title:'<i class="bi bi-star-fill"></i> В избранное' },
            ]
        }
    },

    methods: {
        fnFilterGroup() {
            var oThis = this

            emitter.emit('database-catalog-group-list-filter', this.sGroupGilter)
        },
        fnFilterCategory() {
            var oThis = this

            emitter.emit('database-catalog-category-list-filter', this.sCategoryFilter)
        },
        fnFilterArticle() {
            var oThis = this

            emitter.emit('database-catalog-article-list-filter', this.sArticleFilter)
        },
        fnSelectGroup(sID)
        {
            emitter.emit('database-catalog-group-select', sID)
        },
        fnSelectCategory(sID)
        {
            emitter.emit('database-catalog-category-select', sID)
        },
        fnSelectArticle(sID)
        {
            emitter.emit('database-article-select', sID)
        },
    },

    created() {
        var oThis = this
        _l('created')

        emitter.on('database-catalog-group-selected', (sID) => {
            oThis.sGroupSelectedID = sID
            emitter.emit('database-catalog-category-list-filter', oThis.sCategoryFilter)
        })

        emitter.on('database-catalog-category-selected', (sID) => {
            oThis.sCategorySelectedID = sID
            emitter.emit('database-catalog-article-list-filter', oThis.sArticleFilter)
        })

        emitter.on('database-catalog-article-selected', (sID) => {
            oThis.sArticleSelectedID = sID
        })

        emitter.on('database-repos-selected', () => {
            _l('database-repos-selected')
            emitter.emit('database-catalog-group-list-filter', '')
            emitter.emit('database-catalog-category-list-filter', '')
            emitter.emit('database-catalog-article-list-filter', '')
        })

        emitter.on('database-catalog-group-list-filter-loaded', ({aList, sSelectedArticleID}) => {
            oThis.aGroupList = aList
            oThis.sGroupSelectedID = sSelectedArticleID
        })

        emitter.on('database-catalog-category-list-filter-loaded', ({aList, sSelectedArticleID}) => {
            oThis.aCategoryList = aList
            oThis.sCategorySelectedID = sSelectedArticleID
        })

        emitter.on('database-catalog-article-list-filter-loaded', ({aList, sSelectedArticleID}) => {
            oThis.aArticleList = aList
            oThis.sArticleSelectedID = sSelectedArticleID
        })

        // {"id":3, "name": "Test 3", "category_id": "1", "html": "asdfas fdasf"},
    }
}
</script>

<style>

</style>