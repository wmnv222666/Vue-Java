/** Date: 2020/3/15 ; Author: 姜啸 **/
export default {
  state: {
    // 前序单据创建信息
    createInfo: {}
  },
  getters: {
    GET_CREATE_INFO: state => state.createInfo
  },
  mutations: {
    // 前序创建信息
    SET_CREATE_INFO (state, data) {
      state.createInfo = data
    }
  },
  actions: {
    A_CREATE_INFO_ (store, data) {
      return new Promise(function (resolve, reject) {
        store.commit('SET_CREATE_INFO', data)
        resolve(data)
      })
    }
  }
}
