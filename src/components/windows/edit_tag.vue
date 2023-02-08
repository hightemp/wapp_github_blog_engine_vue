<template>
<div v-show="bShowTagEditWindow">
    <div class="block-overlay"></div>
    <div class="modal show" id="modal-edit-article" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">Статья</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="fnClose"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="" class="form-label">Название</label>
                        <input type="text" class="form-control"  aria-describedby="" v-model="sTagEditWindowTagName">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="fnClose">Отмена</button>
                    <button id="article-edit-save" type="button" class="btn btn-success" @click="fnSave">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a, cc } from "../../lib"

export default {
    name: "EditGroup",

    props: {},

    computed: {
        ...mapState(a`bShowTagEditWindow`),
        ...cc(`sTagEditWindowTagName`), 
    },

    data() {
        return {
        }
    },

    methods: {
        ...mapMutations(a`fnHideTagEditWindow`),
        ...mapActions(a`fnSaveTag`),
        fnClose() {
            this.fnHideTagEditWindow()
        },
        fnSave() {
            this.fnSaveTag()
            this.fnHideTagEditWindow()
        }
    },
}
</script>

<style>

</style>