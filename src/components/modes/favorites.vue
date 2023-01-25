<template>
<div id="mode-favorites" class="mode">
    <div class="favorites-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilter">
            <Dropdown :items="aDropdownMenu" />
        </div>
        <div class="list"></div>
    </div>
</div>
</template>

<script>

import Dropdown from "../dropdown.vue"

export default {
    name: 'FavoritesMode',

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
                { id:"favorites", title:'<i class="bi bi-star-fill"></i> Убрать из ибранного' },
            ],
        }
    },

    methods: {
        fnFilter() {

        },
    }
}
</script>

<style>

</style>