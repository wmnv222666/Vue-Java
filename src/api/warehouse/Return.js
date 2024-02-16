import request from '../api.request'

export var API = {
  // 获取列表
  AGetList (data) {
    return request({
      url: '/return/get_return_list',
      method: 'post',
      data: data
    })
  },
// 获取单据详情
AGetDetailByCode(receiptCode) {
  return request({
    url: '/return/get_return_info/' + receiptCode,
    method: 'get',
    data: {}
  })
},
/**
 * @description: 保存或者提交（isSubmit": 0,(0是save，1是submit) ）
 */
ASavaOrSubmit(data) {
  return request({
    url: '/return/submit',
    method: 'post',
    data: data
  })
},
ADelete (data) {
  return request({
    url: '/return/delete',
    method: 'post',
    data: data
  })
},
}
