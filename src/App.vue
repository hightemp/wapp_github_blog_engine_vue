<template>
    <div 
      class="wrapper"
    >
        <div class="top-panel">
          <div>
            <template v-if="oRepo"> 
            {{oRepo.name}}
            </template>
          </div>
          <div class="top-right-panel">
            <button class="" @click="fnSaveAll" title="Сохранить все"><i class="bi bi-cloud-arrow-up"></i></button>
            <button class="" @click="fnShowRepoWindow" title="Выбрать другую сессию"><i class="bi bi-person-fill"></i></button>
          </div>
        </div>
        <div class="app-modes">
          <a v-for="oMenuItem in aMenu" :key="oMenuItem.class" :class="(sCurrentMode==oMenuItem.class ? 'btn-primary' : '') + ' btn '+oMenuItem.class" :title="oMenuItem.title" @click="fnMenuItemClick(oMenuItem)"><i :class="'bi '+oMenuItem.icon"></i></a>
        </div>
        <div class="current-mode">
          <ListMode v-show="sCurrentMode=='app-mode-list'" />
          <CatalogMode v-show="sCurrentMode=='app-mode-catalog'"/>
          <FavoritesMode v-show="sCurrentMode=='app-mode-favorites'"/>
          <TagsMode v-show="sCurrentMode=='app-mode-tags'"/>
          <LinksMode v-show="sCurrentMode=='app-mode-links'"/>
        </div>

        <PageEditor/>
    </div>

    <ErrorWindow :message="sErrorWindowMessage" :title="sErrorWindowTitle" v-show="bShowErrorWindow"/>

    <AskAPIWindow v-show="bShowRepoWindow"/>

    <EditGroup/>
    <EditCategory/>
    <EditArticle/>
    <EditLink/>

    <SavedToast/>
</template>

<script>
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

import PageEditor from "./components/editor.vue"
import SavedToast from "./components/toasts/saved.vue"

import { Database } from "./Database"

import { emitter } from "./EventBus"

// import Editor from "./ckeditor5-36.0.0-aw402xfhqssx/src/ckeditor"

export default {
  name: 'App',
  components: {
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
  },

  data() {
    return {
      sURL: "",
      oRepo: null,

      bShowErrorWindow: false,
      sErrorWindowMessage: "",
      sErrorWindowTitle: "",

      bShowRepoWindow: true,

      sCurrentMode: "",
      aMenu: [
        { class:"app-mode-list", title:"Список", icon:"bi-justify" },
        { class:"app-mode-catalog", title:"Каталог", icon:"bi-grid-1x2" },
        { class:"app-mode-favorites", title:"Избранное", icon:"bi-star-fill" },
        { class:"app-mode-tags", title:"Тэги", icon:"bi-tags" },
        { class:"app-mode-links", title:"Ссылки", icon:"bi-link" },
        { class:"app-publish-btn", title:"Публикация", icon:"bi-journal-arrow-up" },
        { class:"app-export-btn", title:"Экспорт", icon:"bi-download" },
        { class:"app-import-btn", title:"Импорт", icon:"bi-upload" },
      ],
    }
  },

  methods: {
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
    fnShowRepoWindow() {
      this.bShowRepoWindow = true
    },
    fnSaveAll() {
      emitter.emit('database-db-save')
    },
  },

  mounted() {
    var oThis = this

    document.addEventListener('keydown', e => {
      _l('keydown')
      if (e.ctrlKey && e.keyCode === 83) {
          e.preventDefault();
          _l('CTRL + S');
          oThis.fnSaveAll()
      }
    });
  },

  created() {
    Database.fnInit()
    var oThis = this;

    emitter.emit('app-created')

    emitter.on('database-load-error-github-exception', () => {
      oThis.bShowErrorWindow = true
    })

    emitter.on('database-load-error-notfound', () => {
      oThis.bShowErrorWindow = true
    })

    emitter.on('error-window-close', () => {
      oThis.bShowErrorWindow = false
    })

    emitter.on('repo-window-close', () => {
      oThis.bShowRepoWindow = false
    })

    emitter.on('database-db-load-error-notfound', () => {
      oThis.bShowErrorWindow = true
      oThis.sErrorWindowTitle = "Важно"
      oThis.sErrorWindowMessage = "База заметок не была найдена. И была создана новая."
    })

    emitter.on('database-db-load-error-github-exception', (sE) => {
      oThis.bShowErrorWindow = true
      oThis.sErrorWindowTitle = "Ошибка"
      oThis.sErrorWindowMessage = sE
    })

    emitter.on('database-db-save-error', (sE) => {
      oThis.bShowErrorWindow = true
      oThis.sErrorWindowTitle = "Ошибка"
      oThis.sErrorWindowMessage = sE
    })

    emitter.on('database-repos-loaded', ({aList, iSelectedRepoIndex}) => {
      _l('!!!', {aList, iSelectedRepoIndex})
      if (aList[iSelectedRepoIndex]) {
        var oO = oThis.oRepo = aList[iSelectedRepoIndex]

        oThis.sURL = `http://github.com/${oO.login}/${oO.repo}`
      } else {
        oThis.oRepo = null
      }
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
