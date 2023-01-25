<template>
<div id="mode-tags" class="mode">
    <div class="tags-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" @input="fnFilterTag">
            <Dropdown :items="aTagDropdownMenu" />
        </div>
        <div class="list"></div>
    </div>
    <div class="tags-articles-panel">
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
    name: 'TagsMode',

    components: {
        Dropdown
    },

    data() {
        return {
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

        },
        fnFilterArticle() {

        },
    }
}
</script>

<style>

</style>