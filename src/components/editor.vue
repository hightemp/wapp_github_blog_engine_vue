<template>
    <div class="page-panel" v-show="bShowEditor">
        <div class="actions-panel page-actions-panel">
            <button class="btn btn-success" id="page-save-btn" @click="fnSaveEditorContents"><i class="bi bi-save"></i></button>
            <button class="btn btn-secondary" id="page-link-btn" @click="fnOpenLink"><i class="bi bi-link-45deg"></i></button>
            <!-- <input class="form-control" id="page-title"> -->
        </div>
        <ckeditor 
            :editor="oClassicEditor" 
            v-model="sData" 
            :config="oEditorConfig"
            ref="editorjs"
            style="height: 100%"
            @ready="onEditorReady"
            @input="onEditorInput"
        ></ckeditor>
    </div>
</template>

<script>

import { emitter } from "../EventBus"

import Editor from "@ckeditor/ckeditor5-build-classic"

export default {
    name: 'PageEditor',

    components: {

    },

    data() {
        return {
            bShowEditor: false,

            sData: "",
            oArticle: null,

            oEditor: null,
            oClassicEditor: Editor,

            oEditorConfig: {}
        }
    },

    methods: {
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
            var oThis = this;
            if (oThis.oEditor) {
                emitter.emit('database-article-save-current-content', 
                    oThis.oEditor.getData()
                )
            }
        },
        fnOpenLink() {
            emitter.emit('database-article-open-url')
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

    created() {
        var oThis = this;

        emitter.on('database-catalog-article-selected', (sID, oArticle) => {
            _l('database-catalog-article-selected', {sID, oArticle})
            if (sID == null) {
                oThis.bShowEditor = false;
                oThis.oArticle = null;
            } else {
                oThis.bShowEditor = true;
                oThis.oArticle = oArticle
                if (oThis.oEditor) {
                    oThis.oEditor.setData(oArticle.html)
                }
            }
        })
    }
}
</script>

<style>

</style>