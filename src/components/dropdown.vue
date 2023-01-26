<template>
    <div class="dropdown">
        <a class="btn dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" @click="fnMenuOpen">
        </a>

        <ul :class="'dropdown-menu '+(bOpened ? 'show' : '')">
            <li v-for="oI in aItems" :key="oI.id"><a class="dropdown-item" href="#" @click="fnOnItemClick(oI)" v-html="oI.title"></a></li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['items'],
    data() {
        return {
            aItems: this.items,
            bOpened: false
        }
    },
    methods: {
        fnMenuOpen() {
            this.bOpened = !this.bOpened
        },
        fnOnItemClick(oI) {
            this.bOpened = false
            this.$emit('itemclick', oI)
        }
    }
}
</script>

<style>

</style>