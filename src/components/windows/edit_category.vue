<template>
<div class="modal" id="modal-edit-category" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">Редактирование категории</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="" class="form-label">Родительская группа</label>
                    <div>
                        <select id="edit-category-group" class="form-control box1" aria-describedby="">
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Родительская категория</label>
                    <div>
                        <select id="edit-category-parent" class="form-control box1" aria-describedby="">
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Название</label>
                    <input type="text" class="form-control" id="edit-category-name" aria-describedby="">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button id="category-edit-save" type="button" class="btn btn-success">Сохранить</button>
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