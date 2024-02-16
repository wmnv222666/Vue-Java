<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-17 11:42:22
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-19 09:17:09
 * @Description: description
 -->
<template>
  <div class="login-out">
    <Dropdown @on-click="handleClick" placement="bottom-end">
      <xIcon :size="22" type="iconuser_head"></xIcon>
      <span>{{ username }}</span>
      <Icon :size="22" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="passwordUpdate">{{ $t('base_change_password') }}</DropdownItem>
        <DropdownItem name="logout">{{ $t('base_out_login') }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  computed: {
    username () {
      return this.$store.getters.UserName
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut(this).then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    jumpOperation () {
      this.$router.push({
        name: 'personal_operators'
      })
    },
    jumpLocationManage () {
      this.$router.push({
        name: 'personal_locationManage'
      })
    },
    passwordUpdate () {
      this.$router.push({
        name: 'passwordUpdate'
      })
    },
    handleClick (name) {
      if (name == 'logout') {
        this.logout()
      } else if (name == 'operater') {
        this.jumpOperation()
      } else if (name == 'locationManage') {
        this.jumpLocationManage()
      } else if (name == 'passwordUpdate') {
        this.passwordUpdate()
      }
    }
  }
}
</script>
