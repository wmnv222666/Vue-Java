<!--
 * @Author: your name
 * @Date: 2020-03-23 08:54:08
 * @LastEditTime: 2020-05-28 12:38:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sinobec\src\components\common\language\language.vue
 -->
<template>
  <div>
    <Dropdown trigger="click" @on-click="selectLang">
      <a href="javascript:void(0)">
        {{ title }}
        <Icon type="ios-arrow-down" :size="14" />
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(value, key) in localList" :name="key" :key="`lang-${key}`" :class="`icon-lang-${key}`">{{ value }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: 'Language',
  props: {
    lang: String
  },
  data () {
    return {
      langList: {
        // 'zh-CN': '中文简体',
        'en-US': 'English',
        // 'fr-FR': 'Français'
      },
      localList: {
        // 'zh-CN': '中文简体',
        'en-US': 'English',
        // 'fr-FR': 'Français'
      }
    }
  },
  watch: {
    lang (lang) {
      this.$i18n.locale = lang
    }
  },
  computed: {
    title () {
      return this.langList[this.lang]
    },
    flagIcon () {
      // var
      return 'iconzh'
    }
  },
  methods: {
    selectLang (name) {
      this.$emit('on-lang-change', name)
    }
  }
}
</script>
