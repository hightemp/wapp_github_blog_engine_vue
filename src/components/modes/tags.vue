<template>
<div id="mode-tags" class="mode">
    <div class="tags-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterTag"  v-model="sTagFilter">
            <Dropdown :items="aTagDropdownMenu" />
        </div>
        <div class="list">
            <template v-for="(oI, iI) in aTagsList" v-key="oI.id">
                <div :class="'input-group item-row '+(oI.id == sTagSelectedID ? 'active' : '')" @click="fnSelectTag(oI.id)">
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
    <div class="tags-articles-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterArticle"  v-model="sArticleFilter">
            <Dropdown :items="aArticleDropdownMenu" />
        </div>
        <div class="list">
            <template v-for="(oI, iI) in aArticlesList" v-key="oI.id">
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
    name: 'TagsMode',

    components: {
        Dropdown
    },

    data() {
        return {
            sTagFilter: "",
            sArticleFilter: "",

            sTagSelectedID: null,
            sArticleSelectedID: null,

            aTagsList: [],
            aArticlesList: [],

            aTagDropdownMenu: [
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
        fnFilterTag() {
            var oThis = this

            emitter.emit('database-tag-list-filter', oThis.sTagFilter)
        },
        fnFilterArticle() {
            var oThis = this

            emitter.emit('database-tag-article-list-filter', oThis.sArticleFilter)
        },
        fnSelectTag(sID)
        {
            emitter.emit('database-tag-select', sID)
        },
        fnSelectArticle(sID)
        {
            emitter.emit('database-article-select', sID)
        },
    },

    created() {
        var oThis = this
        _l('created')

        emitter.on('database-catalog-article-selected', (sID) => {
            oThis.sArticleSelectedID = sID
        })

        emitter.on('database-tag-selected', (sID) => {
            oThis.sTagSelectedID = sID
            emitter.emit('database-tag-article-list-filter', oThis.sArticleFilter)
        })

        emitter.on('database-repos-selected', () => {
            emitter.emit('database-tag-article-list-filter', '')
            emitter.emit('database-tag-list-filter', '')
        })

        emitter.on('database-tag-article-list-filter-loaded', ({aList, sSelectedArticleID}) => {
            oThis.aArticlesList = aList
            oThis.sArticleSelectedID = sSelectedArticleID
        })

        emitter.on('database-tag-list-filter-loaded', ({aList, sSelectedArticleID}) => {
            _l('database-tag-list-filter-loaded', {aList, sSelectedArticleID})
            oThis.aTagsList = aList
            oThis.sTagSelectedID = sSelectedArticleID
        })
        // emitter.on('database-article-list-loaded', ({aList, iSelectedArticle}) => {
        //     oThis.aList = aList
        //     oThis.sSelectedID = iSelectedArticle
        //     _l('>>>database-article-list-loaded', {aList})
        // })

        // {"id":3, "name": "Test 3", "category_id": "1", "html": "asdfas fdasf"},
    }
}
</script>

<style>

</style>