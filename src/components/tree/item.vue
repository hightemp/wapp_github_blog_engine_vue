<template>
    <div 
        :class="'input-group item-tree-row '+(oItem.id == sSelectedID ? 'active' : '')"
        @click="fnSelectItem" 
        v-if="oItem.parent_id*1 == sParent*1"
    >
        <!-- <div class="input-group-text">
            <input class="form-check-input mt-0 cb-groups" type="checkbox"/>
        </div> -->
        <a 
            :class="'list-group-item list-group-item-action item-title '" 
        >
            <div class="tree-spacer" v-for="iI in iLevel" :key="iI"></div>
            <a class="item-flag" @click="fnToggleItem">
                <i class="bi bi-dash-square" v-show="bIsOpened"></i>
                <i class="bi bi-plus-square" v-show="!bIsOpened"></i>
            </a>
            <div class="item-inner-title">{{oItem.name}}</div>
        </a>
    </div>
    <template v-for="oI in aList" :key="oI.id">
        <TreeItem
            v-if="oI.parent_id*1 == oItem.id*1 && bIsOpened"
            :item="oI"
            :parent="oItem.id" 
            :list="aList" 
            :selected="sSelectedID" 
            :level="iLevel+1"
            @clickitem="fnForwardSelectItem"
        />
    </template>
</template>

<script>

import TreeList from './list.vue'

export default {
    name: 'TreeItem',

    components: {
        TreeList
    },

    emits: ["clickitem"],

    props: {
        item: Object,
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
        oItem() { return this.item },
        sParent() { return this.parent },
        aList() { return this.list },
        sSelectedID() { return this.selected },
        iLevel() { return this.level }
    },

    data() {
        return {
            bIsOpened: this.item.is_opened,
        }
    },

    methods: {
        fnForwardSelectItem(oI) {
            this.$emit('clickitem', oI)
        },
        fnSelectItem() {
            this.$emit('clickitem', this.oItem)
        },
        fnToggleItem() {
            this.oItem.is_opened = !this.oItem.is_opened
            this.bIsOpened = this.oItem.is_opened
            // this.$forceUpdate()
        }
    }
}
</script>

<style>

</style>