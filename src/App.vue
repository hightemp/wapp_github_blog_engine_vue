<template>
    <div class="wrapper">
        <div class="app-modes">
          <a v-for="oMenuItem in aMenu" :key="oMenuItem.class" :class="(sCurrentMode==oMenuItem.class ? 'btn-primary' : '') + ' btn '+oMenuItem.class" :title="oMenuItem.title" @click="fnMenuItemClick(oMenuItem)"><i :class="'bi '+oMenuItem.icon"></i></a>
        </div>
        <div class="current-mode">
          <template v-if="sCurrentMode=='app-mode-list'">
            <ListMode/>
          </template>
          <template v-if="sCurrentMode=='app-mode-catalog'">
            <CatalogMode/>
          </template>
          <template v-if="sCurrentMode=='app-mode-favorites'">
            <FavoritesMode/>
          </template>
          <template v-if="sCurrentMode=='app-mode-tags'">
            <TagsMode/>
          </template>
          <template v-if="sCurrentMode=='app-mode-links'">
            <LinksMode/>
          </template>
        </div>
        
    </div>

    <!-- <div id="block-overlay"></div> -->
</template>

<script>
import ListMode from "./components/modes/list.vue"
import CatalogMode from "./components/modes/catalog.vue"
import FavoritesMode from "./components/modes/favorites.vue"
import TagsMode from "./components/modes/tags.vue"
import LinksMode from "./components/modes/links.vue"

export default {
  name: 'App',
  components: {
    ListMode,
    CatalogMode,
    FavoritesMode,
    TagsMode,
    LinksMode,
  },

  data() {
    return {
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
      ]
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
    }
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
