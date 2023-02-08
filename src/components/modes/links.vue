<template>
<div id="mode-links" class="mode">
    <div class="links-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sFilter">
            <Dropdown :items="aDropdownMenu" @clickitem="fnClickItem" />
        </div>
        <div class="list">
            <template v-for="oI in aLinkList" :key="oI.id">
                <div :class="'input-group item-row item-links-row '+(oI.id == sSelectedLinkID ? 'active' : '')" @click="fnSelectLink(oI.id)">
                    <a 
                        :class="'list-group-item list-group-item-action item-title '" 
                    >
                        <div class="item-inner-title">{{oI.name}}</div>
                    </a>
                    <a 
                        :href="oI.url"
                        class="list-group-item list-group-item-action item-title link"
                    >
                        <div class="item-inner-title">{{oI.url}}</div>
                    </a>
                </div>
            </template>
        </div>
    </div>
</div>
</template>

<script>

import Dropdown from "../dropdown.vue"

import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a } from "../../lib"

export default {
    name: 'LinksMode',

    components: {
        Dropdown
    },

    computed: {
        ...mapState(a`sSelectedLinkID`),
        ...mapGetters(a`oCurrentLink`), 
        aLinkList() {
            return this.$store.getters.fnFilterLinks(this.sFilter)
        },       
    },

    data() {
        return {
            sFilter: "",

            sSelectedID: null,
            oSelectedLink: null,

            aDropdownMenu: [
                { id:"add", title:'<i class="bi bi-plus-lg"></i> Добавить' },
                { id:"edit", title:'<i class="bi bi-pencil"></i> Редактировать' },
                { id:"delete", title:'<i class="bi bi-trash"></i> Удалить' },
            ]
        }
    },

    methods: {
        ...mapMutations(a`fnSelectLink fnShowLinkEditWindow fnRemoveLink`),
        fnClickItem(oI) {
            var oThis = this

            if (oI.id == "add") {
                this.fnShowLinkEditWindow(null)
            }
            if (oI.id == "edit") {
                if (!this.oCurrentLink) {
                    alert('Нужно выбрать');
                } else {
                    this.fnShowLinkEditWindow(this.oCurrentLink)
                }
            }
            if (oI.id == "delete") {
                if (!this.oCurrentLink) {
                    alert('Нужно выбрать');
                } else {
                    this.fmRemoveLink(this.oCurrentLink)
                }
            }
        },
    },

}
</script>

<style>

</style>