<template>
<div class="selecteion-tag-panel">
    <div class="left-tag-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sAllTagFilter">
            <button class="btn" @click="fnAllTagsFilter"><i class="bi bi-arrow-repeat"></i></button>
        </div>
        <div class="selector">
            <select multiple size="10" v-model="aSelectedAllTags">
                <option v-for="oTag in aTagsList" :key="oTag.id" :value="oTag.id">{{oTag.name}}</option>
            </select>
        </div>
    </div>
    <div class="middle-tag-panel">
        <button class="btn" @click="fnMoveAllLeft"><i class="bi bi-chevron-double-left"></i></button>
        <button class="btn" @click="fnMoveOneLeft"><i class="bi bi-chevron-compact-left"></i></button>
        <button class="btn" @click="fnMoveOneRight"><i class="bi bi-chevron-compact-right"></i></button>
        <button class="btn" @click="fnMoveAllRight"><i class="bi bi-chevron-double-right"></i></button>
    </div>
    <div class="right-tag-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sSelectedTagFilter" @input="fnSelectedTagsFilter">
            <button class="btn" @click="fnSelectedTagsFilter"><i class="bi bi-arrow-repeat"></i></button>
        </div>
        <div class="selector">
            <select multiple size="10" v-model="aSelectedArticleTags">
                <option v-for="oTag in aSelectedTagsList" :key="oTag.id" :value="oTag.id">{{oTag.name}}</option>
            </select>
        </div>
    </div>
</div>
</template>

<script>

import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

import { a } from "../../lib"

export default {
    name: "TagsSelector",

    props: {
        id: [String, null]
    },

    computed: {
        ...mapState(a`sSelectedTagID`),
        ...mapGetters(a`oCurrentTag`),
        sID() {
            return this.id
        },
        aTagsList() {
            return this.$store.getters.fnFilterTags(this.sTagFilter)
        }
    },

    data() {
        return {
            sAllTagFilter: "",
            sSelectedTagFilter: "",

            aAllTagsList: [],
            aSelectedTagsList: [],

            aSelectedAllTags: [],
            aSelectedArticleTags: [],
        }
    },

    watch: {
        id(newVal, oldVal) {
            var oThis = this

            oThis.fnAllTagsFilter()
            oThis.fnSelectedTagsFilter()
        }
    },

    methods: {
        ...mapMutations(a`fnSelectTag fnShowTagEditWindow fnRemoveTag`),
        ...mapActions(a`fnSelectArticle`),
        fnAllTagsFilter() {
            
        },
        fnSelectedTagsFilter() {
            
        },
        fnMoveAllLeft() {
            
        },
        fnMoveOneLeft() {
            
        },
        fnMoveOneRight() {
            
        },
        fnMoveAllRight() {
            
        }
    },

    mounted() {
        var oThis = this
    },
}
</script>

<style>

</style>