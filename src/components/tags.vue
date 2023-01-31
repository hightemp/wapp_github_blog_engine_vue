<template>
<div class="selecteion-tag-panel">
    <div class="left-tag-panel">
        <div class="actions-panel">
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="" v-model="sAllTagFilter" @input="fnAllTagsFilter">
            <button class="btn" @click="fnAllTagsAdd"><i class="bi bi-plus-lg"></i></button>
            <button class="btn" @click="fnAllTagsRemove"><i class="bi bi-trash"></i></button>
        </div>
        <div class="selector">
            <select multiple size="10">

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
            <button class="btn" @click="fnSelectedTagsAdd"><i class="bi bi-plus-lg"></i></button>
            <button class="btn" @click="fnSelectedTagsRemove"><i class="bi bi-trash"></i></button>
        </div>
        <div class="selector">
            <select multiple size="10">

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

    data() {
        return {
            sID: this.id,

            sAllTagFilter: "",
            sSelectedTagFilter: "",

            aAllTagsList: [],
            aSelectedTagsList: []
        }
    },

    methods: {
        fnAllTagsFilter() {
            emitter.emit('database-tag-list-tag-selector-filter', '')
        },
        fnSelectedTagsFilter() {

        },
        fnAllTagsAdd() {

        },
        fnAllTagsRemove() {

        },
        fnSelectedTagsAdd() {

        },
        fnSelectedTagsRemove() {

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

    created() {
        var oThis = this
        emitter.on('database-tag-list-tag-selector-filter-loaded', ({ aList, sSelectedArticleID }) => {
            oThis.aAllTagsList = aList
        })
    }
}
</script>

<style>

</style>