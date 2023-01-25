<template>
<div id="mode-tags" class="mode">
    <div class="tags-panel">
        <div class="actions-panel">
            <a id="tags-reload" class="btn btn-primary" aria-current="page"><i class="bi bi-arrow-repeat"></i></a>
            <button class="btn btn-success" id="tags-groups-create" value=""><i class="bi bi-plus-lg"></i></button>
            <button class="btn btn-secondary" id="tags-groups-edit" value=""><i class="bi bi-pencil"></i></button>
            <button class="btn btn-danger" id="tags-groups-remove" value=""><i class="bi bi-trash"></i></button>
        </div>
        <div class="list"></div>
    </div>
    <div class="tags-articles-panel">
        <div class="actions-panel">
            <a id="tags-article-reload" class="btn btn-primary" aria-current="page"><i class="bi bi-arrow-repeat"></i></a>
            <button class="btn btn-success" id="tags-article-create" value=""><i class="bi bi-plus-lg"></i></button>
            <button class="btn btn-secondary" id="tags-article-edit" value=""><i class="bi bi-pencil"></i></button>
            <button class="btn btn-danger" id="tags-article-remove" value=""><i class="bi bi-trash"></i></button>
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