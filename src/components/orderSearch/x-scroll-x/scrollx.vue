<template>
  <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
    <div class="btn-con left-btn">
      <Icon :size="14" type="ios-arrow-back" @click="handleScroll(240)"/>
    </div>
    <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
      <slot></slot>
    </div>
    <div class="btn-con right-btn">
      <Icon :size="14" type="ios-arrow-forward" @click="handleScroll(-240)"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'scrollbarX',
    data:function () {
      return {
        tagBodyLeft: 0
      }
    },
    methods: {
      handlescroll (e) {
        var type = e.type
        let delta = 0
        if (type === 'DOMMouseScroll' || type === 'mousewheel') {
          delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 30
        }
        this.handleScroll(delta)
      },
      handleScroll (offset) {
        const outerWidth = this.$refs.scrollOuter.offsetWidth
        const bodyWidth = this.$refs.scrollBody.offsetWidth
        if (offset > 0) {
          this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
        } else {
          if (outerWidth < bodyWidth) {
            if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
              this.tagBodyLeft = this.tagBodyLeft
            } else {
              this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
            }
          } else {
            this.tagBodyLeft = 0
          }
        }
      },
    },
  }
</script>

<style scoped>
  .btn-con{
    position: absolute;
    z-index: 1;
    color: #0288d1;
    background: #fff;
    display: inline-block;
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    opacity: 0;
  }

  .btn-con.left-btn {
    left: 0;
  }
  .btn-con.right-btn {
    right: 0
  }
  .scroll-outer {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .scroll-outer .scroll-body {
    display: inline-block;
    position: absolute;
    overflow: visible;
    white-space: nowrap;
    -webkit-transition: left .3s ease;
    transition: left .3s ease;
    padding: 0 18px;
  }

  .scroll-outer:hover .btn-con{
    opacity: 1
  }
</style>
