<template>
<div v-show="bShowErrorWindow">
    <div class="block-overlay"></div>

    <div class="modal fade show" id="modal-error" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="fnClose"></button>
                </div>
                <div class="modal-body">
                    {{ message }}
                </div>
                <div class="modal-footer">
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { a, cc } from "../../lib"

import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

export default {
    props: ['title', 'message'],
    computed: {
        ...cc(`bShowErrorWindow`)
    },
    methods: {
        fnClose() {
            this.bShowErrorWindow = false
        }
    }
}
</script>

<style>

</style>