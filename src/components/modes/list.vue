<template>
<div id="mode-list" class="mode">
    <div class="all-articles-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" @input="fnFilter">
            <Dropdown :items="aDropdownMenu" />
        </div>
        <div class="list"></div>
    </div>
</div>
</template>

<script>

import { Database } from "../../Database"

import Dropdown from "../dropdown.vue"

export default {
    name: 'ListMode',

    components: {
        Dropdown
    },

    data() {
        return {
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

        }
    }
}
</script>

<style>

</style>