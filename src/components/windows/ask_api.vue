<template>
<div id="modal-ask-api-key" class="modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Нужны данные</h5>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="" class="form-label">Логин</label>
                    <input type="text" class="form-control is-empty" id="info-login" aria-describedby="">
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">Репозиторий</label>
                    <input type="text" class="form-control" id="info-repo" aria-describedby="">
                </div>
                <div class="mb-3">
                    <label for="" class="form-label">API Ключ</label>
                    <input type="text" class="form-control" id="info-api-key" aria-describedby="">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="info-save">OK</button>
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