<template>
  <div>
    <Drawer v-model="modalVal" :title="$t('hx_add_msg')" :closable="true" :mask-closable="flag === 'R'" width="600px" @on-visible-change="visibleChange">
      <div>
        <Form :label-width="120" :model="formData">
          <Row>
            <Col span="24">
              <FormItem :label="$t('col_title')" prop="title">
                <span v-if="flag === 'R'">{{ formData.title }}</span>
                <Input :placeholder="$t('ph_title')" v-model="formData.title" v-else maxlength="200" show-word-limit />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem :label="$t('lbl_content')" prop="content">
                <span v-if="flag === 'R'">{{ formData.content }}</span>
                <Input :placeholder="$t('ph_content')" :rows="18" type="textarea" v-model="formData.content" v-else maxlength="200" show-word-limit />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button type="primary" class="ivu-btn-button-create margin-right-24" @click="submit(flag)" v-if="flag !== 'R'">{{ $t('btn_confirm') }}</Button>
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { API } from '@A/message_center/SystemPosts'
export default {
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    messageData: Object,
    flag: String
  },
  data () {
    return {
      list: [],
      formData: {
        title: '',
        content: '',
        noticeId: ''
      }
    }
  },
  computed: {
    modalVal: {
      get: function () {
        return this.modal
      },
      set: function (val) {
        this.$emit('update:modal', val)
      }
    }
  },
  methods: {
    visibleChange (isShow) {
      if (isShow) {
        if (this.flag === 'E') {
          this.formData = this.messageData
        }
      } else {
        this.cancel()
      }
    },
    submit (flag) {
      if (flag === '') {
        API.ASubmitNotice({
          title: this.formData.title,
          content: this.formData.content
        }).then(() => {
          this.$emit('getData')
          this.cancel()
        })

      } else {
        API.AUpdateNotice({
          title: this.formData.title,
          content: this.formData.content,
          noticeId: this.formData.noticeId
        }).then(() => {
          this.$emit('getData')
          this.cancel()
        })
      }
    },
    cancel () {
      this.modalVal = false
      this.formData = {
        title: '',
        content: '',
        noticeId: ''
      }
    }
  }
}
</script>
