<template>
    <div :class="itemClasses">
        <collapse-transition v-if="mounted">
            <div :class="contentClasses" v-show="isActive">
                <div :class="boxClasses"><slot name="content"></slot></div>
            </div>
        </collapse-transition>
      <div :class="headerClasses">
<!--        <div class="x-click-coll" @click.prevent="toggle">-->
<!--          <i class="updown"></i>-->
<!--        </div>-->
      </div>
    </div>
</template>
<script>
    import CollapseTransition from './collapse-transition';
    const prefixCls = 'x-search-collapse';

    export default {
        name: 'sPanel',
        components: { CollapseTransition },
        props: {
            name: {
                type: String
            },
            hideArrow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                index: 0, // use index for default when name is null
                isActive: false,
                mounted: false
            };
        },
        computed: {
            itemClasses () {
                return [
                    `${prefixCls}-item`,
                    {
                        [`${prefixCls}-item-active`]: this.isActive
                    }
                ];
            },
            headerClasses () {
                return `${prefixCls}-header`;
            },
            contentClasses () {
                return `${prefixCls}-content`;
            },
            boxClasses () {
                return `${prefixCls}-content-box`;
            }
        },
        methods: {
            toggle () {
                this.$parent.toggle({
                    name: this.name || this.index,
                    isActive: this.isActive
                });
            }
        },
        mounted () {
            this.mounted = true;
        }
    };
</script>
