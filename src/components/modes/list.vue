<template>
<div id="mode-list" class="mode">
    <div class="all-articles-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sFilter" @input="fnFilter">
            <Dropdown :items="aDropdownMenu" />
        </div>
        <div class="list">
            <template v-for="oI in aList" :key="oI.id">
                <div :class="'input-group item-row '+(oI.id == sSelectedID ? 'active' : '')" @click="fnSelectArticle(oI.id)">
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

import { Database } from "../../Database"

import Dropdown from "../dropdown.vue"

import { emitter } from "../../EventBus"

export default {
    name: 'ListMode',

    components: {
        Dropdown
    },

    data() {
        return {
            aList: [],
            sFilter: "",
            sSelectedID: null,

            aDropdownMenu: [
                { id:"reload", title:'<i class="bi bi-arrow-repeat"></i> Обновить' },
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
                { id:"favorites", title:'<i class="bi bi-star-fill"></i> В избранное' },
            ]
        }
    },

    methods: {
        fnFilter() {
            var oThis = this

            emitter.emit('database-article-list-filter', this.sFilter)
        },
        fnSelectArticle(sID)
        {
            emitter.emit('database-article-select', sID)
        }
    },

    created() {
        var oThis = this
        _l('created')

        emitter.on('database-catalog-article-selected', (sID) => {
            oThis.sSelectedID = sID
        })

        emitter.on('database-repos-selected', () => {
            emitter.emit('database-article-list-filter', '')
        })

        emitter.on('database-article-list-filter-loaded', ({aList, sSelectedID}) => {
            oThis.aList = aList
            oThis.sSelectedID = sSelectedID
        })
        // emitter.on('database-article-list-loaded', ({aList, sSelectedID}) => {
        //     oThis.aList = aList
        //     oThis.sSelectedID = sSelectedID
        //     _l('>>>database-article-list-loaded', {aList})
        // })

        // {"id":3, "name": "Test 3", "category_id": "1", "html": "asdfas fdasf"},
    }
}
</script>

<style>

</style>