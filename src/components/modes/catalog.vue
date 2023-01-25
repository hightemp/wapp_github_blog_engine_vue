<template>
<div id="mode-catalog" class="mode">
    <div class="groups-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterGroup">
            <Dropdown :items="aGroupDropdownMenu" />
        </div>
        <div class="list"></div>
    </div>
    <div class="categories-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterCategory">
            <Dropdown :items="aCategoryDropdownMenu" />
        </div>
        <div class="list"></div>
    </div>
    <div class="articles-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterArticle">
            <Dropdown :items="aArticleDropdownMenu" />
        </div>
        <div class="list"></div>
    </div>
</div>
</template>

<script>

import Dropdown from "../dropdown.vue"

export default {
    name: 'CatalogMode',

    components: {
        Dropdown
    },

    data() {
        return {
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

        },
        fnFilterCategory() {

        },
        fnFilterArticle() {

        },
    }
}
</script>

<style>

</style>