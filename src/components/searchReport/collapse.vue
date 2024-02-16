<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
    const prefixCls = 'x-search-collapse';

    export default {
        name: 'sCollapse',
        props: {
            accordion: {
                type: Boolean,
                default: false
            },
            value: {
                type: [Array, String]
            },
            simple: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                currentValue: this.value
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-simple`]: this.simple
                    }
                ];
            }
        },
        mounted () {
            this.setActive();
        },
        methods: {
            setActive () {
                const activeKey = this.getActiveKey();

                this.$children.forEach((child, index) => {
                    const name = child.name || index.toString();

                    child.isActive = activeKey.indexOf(name) > -1;
                    child.index = index;
                });
            },
            getActiveKey () {
                let activeKey = this.currentValue || [];
                const accordion = this.accordion;

                if (!Array.isArray(activeKey)) {
                    activeKey = [activeKey];
                }

                if (accordion && activeKey.length > 1) {
                    activeKey = [activeKey[0]];
                }

                for (let i = 0; i < activeKey.length; i++) {
                    activeKey[i] = activeKey[i].toString();
                }

                return activeKey;
            },
            toggle (data) {
                const name = data.name.toString();
                let newActiveKey = [];

                if (this.accordion) {
                    if (!data.isActive) {
                        newActiveKey.push(name);
                    }
                } else {
                    let activeKey = this.getActiveKey();
                    const nameIndex = activeKey.indexOf(name);

                    if (data.isActive) {
                        if (nameIndex > -1) {
                            activeKey.splice(nameIndex, 1);
                        }
                    } else {
                        if (nameIndex < 0) {
                            activeKey.push(name);
                        }
                    }

                    newActiveKey = activeKey;
                }

                this.currentValue = newActiveKey;
                this.$emit('input', newActiveKey);
                this.$emit('on-change', newActiveKey);
            }
        },
        watch: {
            value (val) {
                this.currentValue = val;
            },
            currentValue () {
                this.setActive();
            }
        }
    };
</script>
<style>
  .x-search-collapse {
    background-color: #f7f7f7;
    border-radius: 3px;
    border: 1px solid #dcdee2;
  }
  .x-search-collapse>.ivu-collapse-item.ivu-collapse-item-active>.x-search-collapse-header {
    border-bottom: 1px solid #dcdee2;
  }
  .x-search-collapse>.x-search-collapse-item>.x-search-collapse-header {
    height: 38px;
    line-height: 38px;
    padding-left: 16px;
    color: #999;
    cursor: pointer;
    position: relative;
    border-bottom: 1px solid transparent;
    transition: all .2s ease-in-out;
    text-align: center;
  }
  .x-search-collapse > .x-search-collapse-item:first-child {
    border-top: 0;
  }
  .x-search-collapse-content {
    color: #515a6e;
    padding: 0 16px;
    background-color: #fff;
  }
  .x-search-collapse-item:last-child > .x-search-collapse-content {
    border-radius: 0 0 2px 2px;
  }
  .x-search-collapse-content > .x-search-collapse-content-box {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .x-search-collapse .x-click-coll {
    height: 38px;
    text-align: center;
    line-height: 38px;
  }
  .x-search-collapse > .x-search-collapse-item > .x-search-collapse-header .x-click-coll i {
    -webkit-transition: -webkit-transform .2s ease-in-out;
    transition: -webkit-transform .2s ease-in-out;
    transition: transform .2s ease-in-out;
    transition: transform .2s ease-in-out, -webkit-transform .2s ease-in-out;
  }

  .updown{
    backface-visibility: hidden;
    animation: up-down 1.5s ease-in-out infinite;
    -moz-animation: up-down 1.5s ease-in-out infinite;
    -webkit-animation: up-down 1.5s ease-in-out infinite;
    -o-animation: up-down 1.5s ease-in-out infinite;
    display: inline-block;
    height: 20px;
    width: 20px;
    position: absolute;
    left: 50%;
    margin-left: -10px;
    top:9px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABM0lEQVQ4T62TUZWDMBBF39QAxUEdLBK2CiqBRUEtbB3UAZWwDloJXQc4oGtg0zOZhBBgEnpO80ty817mQnjzooHX9ltsNkfUxemlO9r+G8AZTfngcwJkGNEVQAXQBV9Fswra9hcQ1QDuMGbP0AAEbiD6ENAKaIABxvwC+AxAn3ItVIGFyr4fV89BE7A5MJc0A1sGalDzT24A0ZtNhxe0EdAOTdkNk4/qu6OjAbh94cygjcBYgYMb/30ROodVohv9eNW8NjvrElEB4LEIlYBWDXeZg2ELY/6sw03Zjf+Uyk1YgyIB44tsq+kb6tCg1jTZANO0SSVNwlLazKF2t/3f/ZtFyXyBuPJYqraPofItCdMTjt9LXORBsdA8zcVk+YRTaNBGHFWWXnlen7VJwvKVU1GUb08O4sYVRIKPVQAAAABJRU5ErkJggg==') center center;
  }

  @-webkit-keyframes up-down {
    0% { opacity: 1 }
    to {
      -webkit-transform: translate3d(0,-50%,0);
      transform: translate3d(0,-50%,0);
      opacity: 0
    }
  }

  @keyframes up-down {
    0% { opacity: 1 }
    to {
      -webkit-transform: translate3d(0,-50%,0);
      transform: translate3d(0,-50%,0);
      opacity: 0
    }
  }
</style>
