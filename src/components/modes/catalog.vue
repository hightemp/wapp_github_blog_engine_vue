<template>
<div id="mode-catalog" class="mode">
    <div class="groups-panel">
        <div class="actions-panel">
            <a id="catalog-groups-reload" class="btn btn-primary" aria-current="page"><i class="bi bi-arrow-repeat"></i></a>
            <button class="btn btn-success" id="catalog-groups-create" value=""><i class="bi bi-plus-lg"></i></button>
            <button class="btn btn-secondary" id="catalog-groups-edit" value=""><i class="bi bi-pencil"></i></button>
            <button class="btn btn-danger" id="catalog-groups-remove" value=""><i class="bi bi-trash"></i></button>
        </div>
        <div class="list"></div>
    </div>
    <div class="categories-panel">
        <div class="actions-panel">
            <a id="catalog-category-reload" class="btn btn-primary" aria-current="page"><i class="bi bi-arrow-repeat"></i></a>
            <button class="btn btn-success" id="catalog-category-create" value=""><i class="bi bi-plus-lg"></i></button>
            <button class="btn btn-secondary" id="catalog-category-edit" value=""><i class="bi bi-pencil"></i></button>
            <button class="btn btn-danger" id="catalog-category-remove" value=""><i class="bi bi-trash"></i></button>
        </div>
        <div class="list"></div>
    </div>
    <div class="articles-panel">
        <div class="actions-panel">
            <a id="catalog-article-reload" class="btn btn-primary" aria-current="page"><i class="bi bi-arrow-repeat"></i></a>
            <button class="btn btn-success" id="catalog-article-create" value=""><i class="bi bi-plus-lg"></i></button>
            <button class="btn btn-secondary" id="catalog-article-edit" value=""><i class="bi bi-pencil"></i></button>
            <button class="btn btn-danger" id="catalog-article-remove" value=""><i class="bi bi-trash"></i></button>
        </div>
        <div class="list"></div>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style>

</style>