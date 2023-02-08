<template>
    <template v-for="oItem in aList" :key="oItem.id">
        <TreeItem
            :item="oItem"
            :parent="sParent" 
            :list="aList" 
            :selected="sSelectedID" 
            :level="iLevel"
            @clickitem="fnSelectItem"
        />
    </template>
</template>

<script>

import TreeItem from './item.vue'

export default {
    name: 'TreeList',

    components: {
        TreeItem
    },

    emits: ["clickitem"],

    props: {
        parent: {
            type: Number,
            default: 0
        },
        list: Array, 
        selected: [String, Number, null],
        level: {
            type: Number,
            default: 0
        }
    },

    computed: {
        sParent() { return this.parent },
        aList() { return this.list },
        sSelectedID() { return this.selected },
        iLevel() { return this.level }
    },

    data() {
        return {

        }
    },

    methods: {
        fnSelectItem(oI) {
            this.$emit('clickitem', oI)
        },
    }
}
</script>

<style>

</style>