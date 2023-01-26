<template>
<div class="toast-container position-fixed top-0 end-0 p-3">
    <div
        v-show="bShowSaveToast" 
        class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true"
    >
        <div class="toast-header">
            <strong class="me-auto">Сохранено</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            Данные были сохранены
        </div>
    </div>
</div>
</template>

<script>

import { emitter } from "../../EventBus"

export default {
    name: 'SavedToast',

    components: {

    },

    data() {
        return {
            bShowSaveToast: false
        }
    },

    created() {
        var oThis = this
        emitter.on('database-article-saved', () => {
            oThis.bShowSaveToast = true
            setTimeout(() => {
                oThis.bShowSaveToast = false
            }, 2000)
        })
    }
}
</script>

<style>

</style>