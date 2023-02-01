<template>
<div id="mode-catalog" class="mode">
    <div class="groups-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterGroup" v-model="sGroupGilter">
            <Dropdown :items="aGroupDropdownMenu" @clickitem="fnGroupClickItem" />
        </div>
        <div class="list">
            <template v-for="(oI, iI) in aGroupList" :key="oI.id">
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
            <Dropdown :items="aCategoryDropdownMenu" @clickitem="fnCategoryClickItem"/>
        </div>
        <div class="list">
            <TreeList 
                :list="aCategoryList" 
                :parent="0"
                :level="0"
                :selected="sCategorySelectedID"
                @clickitem="fnSelectCategory"
            />
            <!-- <template v-for="(oI, iI) in aCategoryList" v-key="oI.id">
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
            </template> -->
        </div>
    </div>
    <div class="articles-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterArticle" v-model="sArticleFilter">
            <Dropdown :items="aArticleDropdownMenu" @clickitem="fnArticleClickItem"/>
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

import TreeList from "../tree/list.vue"

import Dropdown from "../dropdown.vue"

import { emitter } from "../../EventBus"

export default {
    name: 'CatalogMode',

    components: {
        Dropdown,
        TreeList
    },

    data() {
        return {
            aGroupList: [],
            aCategoryList: [],
            aArticleList: [],

            sGroupSelectedID: null,
            sCategorySelectedID: null,
            sArticleSelectedID: null,

            oSelectedGroup: null,
            oSelectedCategory: null,
            oSelectedArticle: null,

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
        fnSelectCategory(oID)
        {
            emitter.emit('database-catalog-category-select', oID.id)
        },
        fnSelectArticle(sID)
        {
            emitter.emit('database-article-select', sID)
        },

        fnGroupClickItem(oI) {
            var oThis = this

            if (oI.id == "reload") {
                this.fnFilterGroup()
            }
            if (oI.id == "add") {
                emitter.emit('group-window-show', null)
            }
            if (oI.id == "edit") {
                if (!oThis.oSelectedGroup) {
                    alert('Нужно выбрать');
                } else {
                    emitter.emit('group-window-show', oThis.oSelectedGroup)
                }
            }
            if (oI.id == "delete") {
                if (!oThis.oSelectedGroup) {
                    alert('Нужно выбрать');
                } else {
                    emitter.emit('database-catalog-group-remove', oThis.oSelectedGroup.id)
                }
            }
        },
        fnCategoryClickItem(oI) {
            var oThis = this

            if (oI.id == "reload") {
                this.fnFilterCategory()
            }
            if (oI.id == "add") {
                emitter.emit('category-window-show', 
                    null,
                    oThis.oSelectedCategory,
                    oThis.oSelectedGroup,
                    oThis.oSelectedArticle
                )
            }
            if (oI.id == "edit") {
                if (!oThis.oSelectedCategory) {
                    alert('Нужно выбрать');
                } else {
                    emitter.emit('category-window-show', 
                        oThis.oSelectedCategory,
                        oThis.oSelectedCategory,
                        oThis.oSelectedGroup,
                        oThis.oSelectedArticle
                    )
                }
            }
            if (oI.id == "delete") {
                if (!oThis.oSelectedCategory) {
                    alert('Нужно выбрать');
                } else {
                    emitter.emit('database-catalog-category-remove', oThis.oSelectedCategory.id)
                }
            }
        },
        fnArticleClickItem(oI) {
            var oThis = this

            if (oI.id == "reload") {
                this.fnFilterArticle()
            }
            if (oI.id == "add") {
                emitter.emit('article-window-show', 
                    null,
                    oThis.oSelectedCategory,
                    oThis.oSelectedGroup,
                    oThis.oSelectedArticle
                )
            }
            if (oI.id == "edit") {
                if (!oThis.oSelectedArticle) {
                    alert('Нужно выбрать');
                } else {
                    emitter.emit('article-window-show', 
                        oThis.oSelectedArticle,
                        oThis.oSelectedCategory,
                        oThis.oSelectedGroup,
                        oThis.oSelectedArticle
                    )
                }
            }
            if (oI.id == "delete") {
                if (!oThis.oSelectedArticle) {
                    alert('Нужно выбрать');
                } else {
                    emitter.emit('database-article-remove', oThis.oSelectedArticle.id)
                }
            }
        },
    },

    created() {
        var oThis = this
        _l('created')

        emitter.on('database-catalog-group-selected', (sID, oI) => {
            oThis.sGroupSelectedID = sID
            oThis.oSelectedGroup = oI
            _l('???', [oThis.sGroupSelectedID, oThis.oSelectedGroup])
            emitter.emit('database-catalog-category-list-filter', oThis.sCategoryFilter)
        })

        emitter.on('database-catalog-category-selected', (sID, oI) => {
            oThis.sCategorySelectedID = sID
            oThis.oSelectedCategory = oI
            emitter.emit('database-catalog-article-list-filter', oThis.sArticleFilter)
        })

        emitter.on('database-catalog-article-selected', (sID, oI) => {
            oThis.sArticleSelectedID = sID
            oThis.oSelectedArticle = oI
        })

        emitter.on('database-repos-selected', () => {
            _l('database-repos-selected')
            emitter.emit('database-catalog-group-list-filter', '')
            emitter.emit('database-catalog-category-list-filter', '')
            emitter.emit('database-catalog-article-list-filter', '')
        })

        emitter.on('database-catalog-group-list-filter-loaded', ({aList, sSelectedID}) => {
            oThis.aGroupList = aList
            oThis.sGroupSelectedID = sSelectedID
        })

        emitter.on('database-catalog-category-list-filter-loaded', ({aList, sSelectedID}) => {
            oThis.aCategoryList = aList
            oThis.sCategorySelectedID = sSelectedID
        })

        emitter.on('database-catalog-article-list-filter-loaded', ({aList, sSelectedID}) => {
            oThis.aArticleList = aList
            oThis.sArticleSelectedID = sSelectedID
        })


        emitter.on('database-catalog-group-removed', () => {
            oThis.sGroupSelectedID = null
            oThis.sCategorySelectedID = null
            oThis.sArticleSelectedID = null
            emitter.emit('database-catalog-group-select', null)
            emitter.emit('database-catalog-category-select', null)
            emitter.emit('database-article-select', null)
            oThis.fnFilterGroup()
            oThis.fnFilterCategory()
            oThis.fnFilterArticle()
        })

        emitter.on('database-catalog-category-removed', () => {
            oThis.sCategorySelectedID = null
            oThis.sArticleSelectedID = null
            emitter.emit('database-catalog-category-select', null)
            emitter.emit('database-article-select', null)
            oThis.fnFilterCategory()
            oThis.fnFilterArticle()
        })

        emitter.on('database-article-removed', () => {
            oThis.sArticleSelectedID = null
            emitter.emit('database-article-select', null)
            oThis.fnFilterArticle()
        })


        emitter.on('database-catalog-group-list-filter-reload', () => {
            oThis.fnFilterGroup()
        })

        emitter.on('database-catalog-category-list-filter-reload', () => {
            oThis.fnFilterCategory()
        })

        emitter.on('database-catalog-article-list-filter-reload', () => {
            oThis.fnFilterArticle()
        })

        // {"id":3, "name": "Test 3", "category_id": "1", "html": "asdfas fdasf"},
    }
}
</script>

<style>

</style>