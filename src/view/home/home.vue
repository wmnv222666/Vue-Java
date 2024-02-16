<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-23 08:54:09
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-24 11:40:57
 * @Description: description
 -->
<template>
  <div class="x-home">
    <div>
      <Row>
        <Col span="24">
          <div class="i-box clearfix height-box">
            <div class="border-bottom clearfix">
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-align-left">
                <Icon type="ios-list-box-outline" size="20" class="margin-bottom-3" />
                <span class="margin-left-5">{{ $t('lbl_notice') }}</span>
                <!-- <span class="margin-left-5">{{ "Instock" }}</span> -->
              </div>
            </div>
            <div class="body-content">
              <div id="box" class="allHeight">
                <div v-if="!noticeList.length" class="no-approve">{{ $t('base_no_notice') }}</div>
                <div v-else>
                  <div class="dowebok allHeight" id="marqueeContainer">
                    <div class="str_move str_origin">
                      <div class=" notice-block" v-for="(item, i) in noticeList" :key="i">
                        <div class="notice-title">
                          <span class="title">{{ item.title }}</span>
                          <span class="time">{{ $t('lbl_release_time') }}：{{ item.createTime }}</span>
                        </div>
                        <p class="notice-content">{{ item.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Spin fix v-if="loadingCenterRight">
            <Icon type="ios-loading" size="18" class="spin-icon-load"></Icon>
            <div>Loading</div>
          </Spin>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>

import { API } from '@A/home/home'
import { liMarquee } from '_c/marquee/marquee'

export default {
  data () {
    return {
      loadingCenterRight: true,
      noticeList: []
    }
  },
  created () {
    this.getNoticeList()
  },
  methods: {
    // 获取通知的消息
    async getNoticeList () {
      this.loadingCenterRight = true

      var [err, res] = await this.$to(API.AGetNoticeList()); if (err) { return false }
      this.loadingCenterRight = false
      this.noticeList = res.data.dicNoticeList
      if (this.noticeList.length) {
        this.$nextTick(() => {
          liMarquee({
            id: 'marqueeContainer'
          })
        })
      }
    }
  }
}
</script>

<style scoped>
@import 'home.css';
</style>
