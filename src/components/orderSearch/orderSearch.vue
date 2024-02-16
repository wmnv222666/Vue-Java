<template>
  <div class="x-order-search">
    <span>
      <slot></slot>
    </span>
    <div class="x-search-box">
      <div class="x-condition-box">
        <span v-if="mode === 'checkbox'">
              <CheckboxGroup v-model="selectedData" @on-change="changeHandle">
                <Checkbox v-for="(item,i) in data" :label="item.value" :key="i">{{item.label}}</Checkbox>
              </CheckboxGroup>
          </span>

        <span v-else>
            <RadioGroup v-model="selectedData" @on-change="changeHandle">
              <Radio v-for="(item,i) in data" :label="item.value" :key="i">{{item.label}}</Radio>
            </RadioGroup>
        </span>
<!--        <scrollbarX>-->
<!--          -->
<!--        </scrollbarX>-->
      </div>
      <!--条件输入-->
      <Input class="x-search-input" v-model="condition" search :placeholder="$t('ph_placeholder_15')" @on-search="search"/>
      <!--高级搜索-->
<!--      <Button class="x-advanced-search" icon="ios-funnel-outline" @click="advancedSearch"></Button>-->
    </div>
  </div>

</template>

<script>
  import scrollbarX from './x-scroll-x'

  export default {
    name: 'orderSearch',
    props: {
      mode: {
        type: String,
        default: 'checkbox'
      },
      data: {
        type: Array,
        default() {
          return []
        }
      },
      selected: [Array, String, Number]
    },
    computed:{
      selectedData: {
        get: function () {
          return this.selected
        },
        set: function (val) {
          this.$emit('update:selected', val)
        }
      }
    },
    components: {
      scrollbarX
    },
    data () {
      return {
        condition: ''
      }
    },
    methods: {
      search () {
        this.$emit('on-enter', this.condition.trim())
      },
      advancedSearch () {
        this.$emit('on-search')
      },
      changeHandle (selection) {
        this.$emit('on-change', selection)
      }
    },
  }
</script>
<style>
  .x-search-box {
    float: right;
  }

  .x-search-input {
    width: 220px;
  }

  .x-condition-box {
    height: 32px;
    display: inline-block;
    vertical-align: middle;
    line-height: 32px;
    margin-right: 24px;
    /*width: 500px;*/
  }

  .x-order-search .x-advanced-search {
    border: none;
    outline: none;
    margin-left: 10px;
    font-size: 20px;
    font-weight: bold;
  }

</style>
