<template>
    <div class="page-panel" v-show="bShowEditor">
        <div class="actions-panel page-actions-panel">
            <button class="btn btn-success" @click="fnSaveEditorContents"><i class="bi bi-save"></i></button>
            <button class="btn btn-secondary" @click="fnOpenLink"><i class="bi bi-link-45deg"></i></button>
            <button :class="'btn '+(sCurrentTab=='page' ? 'btn-primary' : '')" @click="sCurrentTab='page'"><i class="bi bi-file-code"></i></button>
            <button :class="'btn '+(sCurrentTab=='tags' ? 'btn-primary' : '')" @click="sCurrentTab='tags'"><i class="bi bi-tags"></i></button>
            <button :class="'btn '+(sCurrentTab=='images' ? 'btn-primary' : '')" @click="sCurrentTab='images'"><i class="bi bi-image"></i></button>
            <button :class="'btn '+(sCurrentTab=='comments' ? 'btn-primary' : '')" @click="sCurrentTab='comments'"><i class="bi bi-journal-text"></i></button>
            <div class="actions-panel-spacer"></div>
            <button class="btn btn-danger" @click="fnClose"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="tab-page" v-show="sCurrentTab=='page'">
            <editor
                api-key="tsbudecaa1nyy1uzzd269l4hjzko6g94gcjruqgfy6r1cl3a"
                :init="{
                    height: 'calc(100vh - 30px)',
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap codesample print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | codesample code \
                        bullist numlist outdent indent | removeformat | help',
                    codesample_languages: [
                        {text: 'HTML/XML', value: 'markup'},
                        {text: 'JavaScript', value: 'javascript'},
                        {text: 'CSS', value: 'css'},
                        {text: 'PHP', value: 'php'},
                        {text: 'Ruby', value: 'ruby'},
                        {text: 'Python', value: 'python'},
                        {text: 'Java', value: 'java'},
                        {text: 'SQL',value:'sql'},
                        {text: 'YAML',value:'yaml'},
                        {text: 'C', value: 'c'},
                        {text: 'C#', value: 'csharp'},
                        {text: 'C++', value: 'cpp'}
                    ],
                }"
                v-model="sArticleContent"
                @init="onEditorReady"
                @execCommand="fnExecCommand"
                @keyDown="fnKeyDown"
            />
        </div>
        <div class="tab-page-tags" v-show="sCurrentTab=='tags'">
            <TagsSelector :id="sArticleID"/>
        </div>
        <div class="tab-page-images" v-show="sCurrentTab=='images'">
            <div class="actions-panel">
                <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sImagesFilter" @input="fnImagesFilter">
            </div>
            <div class="list">
                <template v-for="oI in aImagesList" :key="oI.id">
                    <div :class="'input-group item-row item-image-row'">
                        <a 
                            :class="'list-group-item list-group-item-action item-title '" 
                        >
                            <div class="item-inner-title">
                                <img src="">
                            </div>
                        </a>
                        <div class="image-path">

                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="tab-page-comments" v-show="sCurrentTab=='comments'">
            <div class="actions-panel">
                <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sCommentsFilter" @input="fnCommentsFilter">
            </div>
            <div>
                
            </div>
        </div>
    </div>
</template>

<script>

import TagsSelector from "./tags/tags.vue"

import editor from '@tinymce/tinymce-vue'
// import Editor from "@ckeditor/ckeditor5-build-classic"

import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a, cc } from "../lib"

export default {
    name: 'PageEditor',

    props: [
    ],

    components: {
        TagsSelector,
        editor
    },

    computed: {
        ...mapState(a`bShowEditor`),
        ...mapGetters(a`oCurrentRepo fnGetCurrentArticleLink fnSaveArticlePage fnSaveDatabase`),
        ...cc(`bSaveEditor sArticleContent`)
    },

    data() {
        return {
            sCurrentTab: "page",

            sImagesFilter: "",
            sCommentsFilter: "",

            sData: "",
            sArticleID: null,
            oArticle: null,

            oEditor: null,

            oEditorConfig: {},

            aImagesList: [],
        }
    },

    methods: {
        ...mapMutations(a`fnHideEditor`),
        ...mapActions(a`fnSave`),

        onEditorReady(oEvent, oEditor) {
            this.oEditor = oEditor
        },
        fnExecCommand(oEvent, oEditor) {
            // console.log(oEvent, oEditor)
        },
        fnKeyDown(oEvent, oEditor) {
            // console.log(oEvent, oEditor)
            if (oEvent.ctrlKey && oEvent.keyCode === 83) {
                oEvent.preventDefault();
                _l('CTRL + S');
                this.fnSave()
            }
        },
        fnOpenLink() {
            window.open(this.fnGetCurrentArticleLink())
        },
        fnImagesFilter() {

        },
        fnCommentsFilter() {

        },
        fnClose() {
            this.fnHideEditor()
        }
    },

    mounted() {
        var oThis = this
    },
}
</script>

<style>

</style>