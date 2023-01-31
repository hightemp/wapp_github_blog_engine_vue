<template>
<div class="selecteion-tag-panel">
    <div class="left-tag-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sAllTagFilter" @input="fnAllTagsFilter">
            <button class="btn" @click="fnAllTagsFilter"><i class="bi bi-arrow-repeat"></i></button>
        </div>
        <div class="selector">
            <select multiple size="10" v-model="aSelectedAllTags">
                <option v-for="oTag in aAllTagsList" :key="oTag.id" :value="oTag.id">{{oTag.name}}</option>
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

import { emitter } from "../EventBus"

export default {
    name: "TagsSelector",

    props: {
        id: [String, null]
    },

    computed: {
        sID() {
            return this.id
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
        fnAllTagsFilter() {
            _l('database-tag-list-tag-selector-filter')
            emitter.emit('database-tag-list-tag-selector-filter', this.sAllTagFilter)
        },
        fnSelectedTagsFilter() {
            emitter.emit('database-tag-list-tag-selector-article-filter', this.sID, this.sSelectedTagFilter)
        },
        fnMoveAllLeft() {
            emitter.emit('database-tag-list-tag-selector-remove-tags', this.sID, this.aSelectedTagsList.map((oI) => oI.id))
        },
        fnMoveOneLeft() {
            emitter.emit('database-tag-list-tag-selector-remove-tags', this.sID, this.aSelectedArticleTags)
        },
        fnMoveOneRight() {
            emitter.emit('database-tag-list-tag-selector-add-tags', this.sID, this.aSelectedAllTags)
        },
        fnMoveAllRight() {
            emitter.emit('database-tag-list-tag-selector-add-tags', this.sID, this.aAllTagsList.map((oI) => oI.id))
        }
    },

    mounted() {
        var oThis = this

        oThis.fnAllTagsFilter()
        oThis.fnSelectedTagsFilter()
    },

    created() {
        var oThis = this

        emitter.on('database-tag-list-tag-selector-filter-loaded', ({ aList, sSelectedID }) => {
            oThis.aAllTagsList = aList
        })

        emitter.on('database-tag-list-tag-selector-article-filter-loaded', ({ aList, sSelectedID }) => {
            oThis.aSelectedTagsList = aList
        })

        emitter.on('database-tag-list-tag-selector-remove-tags-success', () => {
            oThis.fnSelectedTagsFilter()
        })

        emitter.on('database-tag-list-tag-selector-add-tags-success', () => {
            oThis.fnSelectedTagsFilter()
        })
    }
}
</script>

<style>

</style>