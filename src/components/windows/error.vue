<template>
<div class="block-overlay"></div>

<div class="modal" id="modal-error" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="fnCloseErrorWindow"></button>
            </div>
            <div class="modal-body">
                {{ message }}
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>
</template>

<script>

import { emitter } from '../../EventBus'

export default {
    props: {
        message: String,
        title: String,
    },

    methods: {
        fnCloseErrorWindow() {
            emitter.emit('error-window-close')
        }
    }
}
</script>

<style>

</style>