<template>
<div id="mode-links" class="mode">
    <div class="links-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sFilter" @input="fnFilter">
            <Dropdown :items="aDropdownMenu" />
        </div>
        <div class="list">
            <template v-for="(oI, iI) in aList" :key="oI.id">
                <div :class="'input-group item-row item-links-row '+(oI.id == sSelectedID ? 'active' : '')" @click="fnSelect(oI.id)">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0 cb-groups" type="checkbox"/>
                    </div>
                    <a 
                        :class="'list-group-item list-group-item-action item-title '" 
                    >
                        <div class="item-inner-title">{{oI.name}}</div>
                    </a>
                    <a 
                        :href="oI.url"
                        class="list-group-item list-group-item-action item-title link"
                    >
                        <div class="item-inner-title">{{oI.url}}</div>
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
    name: 'LinksMode',

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

            emitter.emit('database-link-list-filter', this.sFilter)
        },
        fnSelect(sID)
        {
            emitter.emit('database-link-select', sID)
        }
    },

    created() {
        var oThis = this
        _l('created')

        emitter.on('database-link-selected', (sID) => {
            oThis.sSelectedID = sID
        })

        emitter.on('database-repos-load', () => {
            emitter.emit('database-link-list-filter', '')
        })

        emitter.on('database-link-list-filter-loaded', ({aList, sSelectedID}) => {
            oThis.aList = aList
            oThis.sSelectedID = sSelectedID
        })
    }
}
</script>

<style>

</style>