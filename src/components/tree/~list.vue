<template>
    <template v-for="oI in aList" v-key="oI.id">
        <div 
            :class="'input-group item-tree-row '+(oI.id == sSelectedID ? 'active' : '')"
            @click="fnSelectItem(oI)" 
            v-if="oI.parent_id*1 == sParent*1"
        >
            <div class="input-group-text">
                <input class="form-check-input mt-0 cb-groups" type="checkbox"/>
            </div>
            <div class="input-group-text item-flag-group"><a class="item-flag" @click="fnToggleItem(oI)"><i class="bi bi-dash-square" v-show="oI.is_opened"></i><i class="bi bi-plus-square" v-show="!oI.is_opened"></i></a></div>
            <a 
                :class="'list-group-item list-group-item-action item-title '" 
            >
                <div class="tree-spacer" v-for="iI in iLevel" v-key="iI"></div>
                <div class="item-inner-title">{{oI.name}}</div>
            </a>
        </div>
        <Tree 
            v-if="oI.parent_id*1 == sParent*1 && oI.is_opened"
            :parent="oI.id" 
            :list="aList" 
            :selected="sSelectedID" 
            :level="iLevel+1"
            @clickitem="fnSelectItem"
        />
    </template>
</template>

<script>

import Tree from './tree.vue'

export default {
    name: 'TreeList',

    components: {
        Tree
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
            _l({oI})
            this.$emit('clickitem', oI)
        },
        fnToggleItem(oI) {
            oI.is_opened = !oI.is_opened
            this.$forceUpdate()
        }
    }
}
</script>

<style>

</style>