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
            <ckeditor 
                :editor="oClassicEditor" 
                v-model="sData" 
                :config="oEditorConfig"
                ref="editorjs"
                style="height: 100%"
                @ready="onEditorReady"
                
            ></ckeditor>
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

import Editor from "@ckeditor/ckeditor5-build-classic"

import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a, cc } from "../lib"

export default {
    name: 'PageEditor',

    props: [
    ],

    components: {
        TagsSelector,
    },

    computed: {
        ...mapState(a`bShowEditor sArticleContent`),
        ...cc(`bSaveEditor`)
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
            oClassicEditor: Editor,

            oEditorConfig: {},

            aImagesList: [],
        }
    },

    watch: {
        sArticleContent (sN, sO) {
            this.oEditor.setData(sN)
        },
        bSaveEditor(sN, oO) {
            if (sN) {
                this.bSaveEditor = false
                this.fnSaveEditorContents()
            }
        }
    },

    methods: {
        ...mapMutations(a`fnHideEditor`),
        ...mapActions(a`fnSaveArticleContent fnSaveArticlePage`),

        onEditorReady(editor) {
            _l('onEditorReady')
            this.oEditor = editor
            editor.editing.view.change( writer => {
                writer.setStyle( 
                    'height', 
                    'calc(100vh - 20px - 40px - 30px)', 
                    editor.editing.view.document.getRoot() 
                );
            })
        },
        onEditorInput() {
            this.fnSaveEditorContents()
        },
        fnSaveEditorContents() {
            if (this.oEditor) {
                console.log(this.oEditor.getData())
                this.fnSaveArticleContent(this.oEditor.getData())
                // this.fnSaveArticlePage()
            }
        },
        fnOpenLink() {
            
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
        // this.oEditor = new EditorJS('editorjs');

        // if (!oThis.oEditor)
        //     Editor
        //         .create(
        //             this.$refs.editorjs,
        //             {
        //                 // ...oDefaultConfig,
        //                 codeBlock: {
        //                     languages: [
        //                         { language: 'plaintext', label: 'Plain text', class: '' },
        //                         { language: 'php', label: 'PHP', class: 'php-code' },
        //                         { language: 'python', label: 'Python' },
        //                         { language: 'css', label: 'CSS' },
        //                         { language: 'html', label: 'HTML' },
        //                         { language: 'javascript', label: 'JavaScript', class: 'js javascript js-code' },
        //                         { language: 'shell', label: 'SHELL' },
        //                     ]
        //                 }
        //             }
        //         )
        //         .then((editor) => {
        //             oThis.oEditor = editor
        //             editor.setData('');
        //             _l(editor);
        //             editor.editing.view.change( writer => {
        //                 writer.setStyle( 'height', 'calc(100vh - 20px - 40px - 30px)', editor.editing.view.document.getRoot() );
        //             });
        //         })
        //         .catch( error => {
        //             console.error( error );
        //         } );
    },
}
</script>

<style>

</style>