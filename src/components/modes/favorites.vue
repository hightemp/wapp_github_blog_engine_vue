<template>
<div id="mode-favorites" class="mode">
    <div class="favorites-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilter" v-model="sFavFilter">
            <Dropdown :items="aDropdownMenu" />
        </div>
        <div class="list">
            <template v-for="(oI, iI) in aFavList" :key="oI.id">
                <div :class="'input-group item-row '+(oI.id == sFavSelectedID ? 'active' : '')" @click="fnSelect(oI.id)">
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
    name: 'FavoritesMode',

    components: {
        Dropdown
    },

    data() {
        return {
            sFavFilter: "",
            aFavList: [],

            sFavSelectedID: null,

            aDropdownMenu: [
                { id:"reload", title:'<i class="bi bi-arrow-repeat"></i> Обновить' },
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
                { id:"favorites", title:'<i class="bi bi-star-fill"></i> Убрать из ибранного' },
            ],
        }
    },

    methods: {
        fnFilter() {
            var oThis = this

            emitter.emit('database-favorites-article-list-filter', this.sFavFilter)
        },
        fnSelect(sID)
        {
            emitter.emit('database-article-select', sID)
        },
    },

    created() {
        var oThis = this
        _l('created')

        emitter.on('database-catalog-article-selected', (sID) => {
            oThis.sSelectedID = sID
        })

        emitter.on('database-repos-load', () => {
            emitter.emit('database-favorites-article-list-filter', '')
        })

        emitter.on('database-article-list-filter-loaded', ({aList, sSelectedID}) => {
            oThis.aFavList = aList
            oThis.sFavSelectedID = sSelectedID
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