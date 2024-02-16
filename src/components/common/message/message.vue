<template>
  <div class="message-sys">
    <div class="head">
      <div class="cont">
        <a href="javascript:void(0)" @click="taskList">
          <Badge :count="taskCount"  type="success">
            <xIcon type="icontodo_list_head" size="26"/>
          </Badge>
        </a>
      </div>
    </div>
   <div class="head">
     <Tooltip content="我的审批">
       <div class="cont">
         <a href="javascript:void(0)" @click="approval">
           <Badge :count="appCount"  type="success">
             <xIcon type="iconnotice_hesd" size="26"/>
           </Badge>
         </a>
       </div>
     </Tooltip>
   </div>
    <div class="head">
      <Tooltip content="我的经办">
        <div class="cont">
          <a href="javascript:void(0)" @click="agencyList">
            <Badge :count="agencyCount"  type="success">
              <xIcon type="iconnews_head" size="26"></xIcon>
            </Badge>
          </a>
        </div>
      </Tooltip>
    </div>
  </div>
</template>

<script>
  import { getCookie} from '@/libs/utils'
export default {
  name: 'Message',
  data () {
    return {
      taskCount: 0,
      appCount: 0,
      agencyCount: 0,
      timer: null
    }
  },
  // computed: {
  //   messageFlag () {
  //     return localStorage.getItem('msgGroup')
  //     // return getCookie('messageFlag')
  //   }
  // },
  mounted () {
    if (localStorage.getItem('messageFlag')) {
      this.timer =  window.setInterval(() => {
        setTimeout(this.fun(), 0)
      }, 5000)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    fun () {
      // this.taskListCount()
      // this.approvalCount()
      // this.agencyListCount()
    },
    // 跳转相应页面
    taskList () {
      this.$router.push({
        name: 'my_task_list'
      })
    },
    approval () {
      this.$router.push({
        name: 'my_approval'
      })
    },
    agencyList () {
      this.$router.push({
        name: 'my_agency_list'
      })
    },
    //查询审批、经办、任务清单的数量
    taskListCount () {
      var _this = this
      this.loading = true
      this.$ajax(_this, {
        url: 'push_message/push_task_message',
        method: 'post',
        notLoading: true
      }).then(function (res) {
        _this.loading = false
        _this.taskCount = parseInt(res.data.data)
      }).catch(() => {
        _this.loading = false
      })
    },
    approvalCount () {
      var _this = this
      this.loading = true
      this.$ajax(_this, {
        url: 'push_message/push_wf_message',
        method: 'post',
        notLoading: true
      }).then(function (res) {
        _this.loading = false
        _this.appCount = parseInt(res.data.data)
      }).catch(() => {
        _this.loading = false
      })
    },
    agencyListCount () {
      var _this = this
      this.loading = true
      this.$ajax(_this, {
        url: 'push_message/push_actor_message',
        method: 'post',
        notLoading: true
      }).then(function (res) {
        _this.loading = false
        _this.agencyCount = parseInt(res.data.data)
      }).catch(() => {
        _this.loading = false
      })
    }
  }
}
</script>
