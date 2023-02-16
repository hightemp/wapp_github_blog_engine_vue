<template>
    <div 
      class="wrapper"
    >
        <div class="app-modes">
          <button class="btn" @click="fnShowRepoWindow" title="Выбрать другую сессию"><i class="bi bi-person-fill"></i></button>
          <button class="btn" @click="fnSaveAll" title="Сохранить все"><i class="bi bi-cloud-arrow-up"></i></button>
          <hr/>
          <a v-for="oMenuItem in aMenu" :key="oMenuItem.class" :class="(sCurrentMode==oMenuItem.class ? 'btn-primary' : '') + ' btn '+oMenuItem.class" :title="oMenuItem.title" @click="fnMenuItemClick(oMenuItem)"><i :class="'bi '+oMenuItem.icon"></i></a>
          <hr/>
          <button class="btn" title="Экспортировать" @click="fnExport"><i class="bi bi-box-arrow-down"></i></button>
          <button class="btn btn-import" title="Импортировать"><i class="bi bi-box-arrow-in-up"></i><label><input type="file" ref="file_selector" @change="fnFileImportChange" /></label></button>
        </div>
        <div class="current-mode">
          <ListMode v-show="sCurrentMode=='app-mode-list'" />
          <CatalogMode v-show="sCurrentMode=='app-mode-catalog'"/>
          <FavoritesMode v-show="sCurrentMode=='app-mode-favorites'"/>
          <TagsMode v-show="sCurrentMode=='app-mode-tags'"/>
          <LinksMode v-show="sCurrentMode=='app-mode-links'"/>
        </div>

        <div class="editor-wrapper">
          <PageEditor/>
        </div>
    </div>

    <ErrorWindow :message="sErrorWindowMessage" :title="sErrorWindowTitle"/>

    <AskAPIWindow/>

    <EditGroup/>
    <EditCategory/>
    <EditArticle/>
    <EditLink/>
    <EditTag/>

    <Loader/>
    <SavedToast/>
</template>

<script>
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a, cc } from "./lib"

import Loader from './components/loader.vue'
import ListMode from "./components/modes/list.vue"
import CatalogMode from "./components/modes/catalog.vue"
import FavoritesMode from "./components/modes/favorites.vue"
import TagsMode from "./components/modes/tags.vue"
import LinksMode from "./components/modes/links.vue"

import ErrorWindow from "./components/windows/error.vue"
import AskAPIWindow from "./components/windows/ask_api.vue"

import EditGroup from "./components/windows/edit_group.vue"
import EditCategory from "./components/windows/edit_category.vue"
import EditArticle from "./components/windows/edit_article.vue"
import EditLink from "./components/windows/edit_link.vue"
import EditTag from "./components/windows/edit_tag.vue"

import PageEditor from "./components/editor.vue"
import SavedToast from "./components/toasts/saved.vue"

import { fnSaveFile } from "./lib"

export default {
  name: 'App',
  components: {
    Loader,
    ListMode,
    CatalogMode,
    FavoritesMode,
    TagsMode,
    LinksMode,
    ErrorWindow,
    AskAPIWindow,
    PageEditor,
    SavedToast,
    EditGroup,
    EditCategory,
    EditArticle,
    EditLink,
    EditTag,
  },

  computed: {
    ...mapState(a`bShowRepoWindow sSelectedArticleID`),
    ...cc(`bShowSaveToast bSaveEditor`),
    sCurrentMode: {
      set(sMode) { this.$store.commit('fnUpdateMode', sMode) },
      get() { return this.$store.state.sCurrentMode }
    }
  },

  data() {
    return {
      aMenu: [
        { class:"app-mode-list", title:"Список", icon:"bi-justify" },
        { class:"app-mode-catalog", title:"Каталог", icon:"bi-grid-1x2" },
        { class:"app-mode-favorites", title:"Избранное", icon:"bi-star-fill" },
        { class:"app-mode-tags", title:"Тэги", icon:"bi-tags" },
        { class:"app-mode-links", title:"Ссылки", icon:"bi-link" },
        { class:"app-publish-btn", title:"Публикация", icon:"bi-journal-arrow-up" },
      ],
    }
  },

  methods: {
    ...mapMutations(a`fnLoadRepos fnShowRepoWindow fnCleanDatabase fnLoadDemoDatabase`),
    ...mapActions(a`fnSaveDatabase fnSaveArticlePage fnPublishIndexFile fnSave fnImportDatabase fnExportDatabase`),

    fnMenuItemClick(oMenuItem)
    {
      if (oMenuItem.class == "app-publish-btn") {

      }
      else if (oMenuItem.class == "app-export-btn") {
        
      }
      else if (oMenuItem.class == "app-import-btn") {

      } else {
        this.sCurrentMode = oMenuItem.class
      }
    },
    fnSaveAll() {
      this.fnSave()
    },
    fnExport() {
      this.fnExportDatabase()
    },
    fnImport() {
      let oFile = this.$refs.file_selector.files[0];
      let reader = new FileReader();
      var oThis = this

      reader.readAsText(oFile);

      reader.onload = function() {
        oThis.fnImportDatabase(reader.result)
      };

      reader.onerror = function() {
        console.error(reader.error);
      };
    },
    fnFileImportChange() {
      this.fnImport()
    },
    fnCleanDatabaseClick() {
      if (confirm("Все данные будут удалены. Продолжить?")) {
        this.fnCleanDatabase()
        this.fnSaveDatabase()
        this.fnPublishIndexFile()
        this.bShowSaveToast = true
      }
    },
    fnLoadDemoDatabaseClick() {
      if (confirm("Все данные будут удалены. Продолжить?")) {
        this.fnLoadDemoDatabase()
        this.fnSaveDatabase()
        this.fnPublishIndexFile()
        this.bShowSaveToast = true
      }
    }
  },

  mounted() {
    var oThis = this

    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.keyCode === 83) {
          e.preventDefault();
          _l('CTRL + S');
          oThis.fnSaveAll()
      }
    });
  },

  created() {
    this.fnLoadRepos()
  }
}
</script>
