<template>
    <TreeList 
        :parent="sParent" 
        :list="aList" 
        :selected="sSelectedID" 
        :level="iLevel"
        @clickitem="fnSelectItem"
    />
</template>

<script>

import TreeList from "./list.vue"

export default {
    name: 'Tree',
    components:{
        TreeList
    },
    props: {
        parent: {
            type: Number,
            default: 0
        },
        list: Array, 
        selected: String,
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