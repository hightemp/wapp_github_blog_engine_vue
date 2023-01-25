<template>
<div class="modal" id="modal-edit-article" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">Статья</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="" class="form-label">Название</label>
                    <input type="text" class="form-control" id="article-name" aria-describedby="">
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Категория</label>
                    <select class="form-control" id="article-category" aria-describedby=""></select>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Тэги</label>
                    <div id="article-tags" class="tags-lists">
                        <select class="form-control box1" aria-describedby="" 
                            multiple = "multiple"
                            size = "10"
                        >

                        </select>
                        <div class="tags-lists-buttons">
                            <button class="btn tags-list-all-2-1"><i class="bi bi-chevron-double-left"></i></button>
                            <button class="btn tags-list-one-2-1"><i class="bi bi-chevron-compact-left"></i></button>
                            <button class="btn tags-list-one-1-2"><i class="bi bi-chevron-compact-right"></i></button>
                            <button class="btn tags-list-all-1-2"><i class="bi bi-chevron-double-right"></i></button>
                        </div>
                        <select class="form-control box2" aria-describedby=""
                            multiple = "multiple"
                            size = "10"                        
                        >
                            
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button id="article-edit-save" type="button" class="btn btn-success">Сохранить</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style>

</style>