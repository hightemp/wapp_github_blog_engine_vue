<template>
<div id="mode-list" class="mode">
    <div class="all-articles-panel">
        <div class="actions-panel">
            <a id="all-articles-reload" class="btn btn-primary" aria-current="page"><i class="bi bi-arrow-repeat"></i></a>
            <button class="btn btn-success" name="all-articles-create" value=""><i class="bi bi-plus-lg"></i></button>
            <button class="btn btn-secondary" name="all-articles-edit" value=""><i class="bi bi-pencil"></i></button>
            <button class="btn btn-danger" name="all-articles-remove" value=""><i class="bi bi-trash"></i></button>
            <button class="btn btn-secondary" name="all-articles-toggle-favorite" value=""><i class="bi bi-star-fill"></i></button>
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