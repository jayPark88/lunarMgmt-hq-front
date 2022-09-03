<template>
    <span :class="setClass()">
        <slot></slot>
    </span>
</template>

<script>
export default {
    data() {
        return {
            disabled: false,
        }
    },
    methods: {
        setClass() {
            const naviMenu = this.$store.getters.getNaviMenu
            let resultClass = ''

            if (naviMenu && naviMenu.readYn === 'N') {
                resultClass += 'none'
            } else if (naviMenu && naviMenu.writeYn === 'N') {
                resultClass += 'read-only'
            }
            return resultClass === '' ? null : resultClass.trimLeft()
        },
    },
}
</script>

<style lang="scss" scoped>
.read-only {
    pointer-events: none;
    filter: grayscale(1);
    opacity: 0.5;
}

.none {
    display: none;
}

.disabled {
    pointer-events: none;
}
</style>