import { login, logout, getMenuInfo } from '@/api/user'
import { setToken, getToken, localRead, localSave } from '@/libs/utils'

export default {
  state: {
    cropCode: '',
    userName: '',
    userId: '',
    userCode: '',
    token: getToken(),
    access: '',
    hasGetInfo: false
  },
  getters: {
    UserName: (state) => state.userName,
    UserId: (state) => state.userId,
    UserCode: (state) => state.userCode,
    UserCropCode: (state) => state.cropCode
  },
  mutations: {
    setCropCode (state, cropCode) {
      state.cropCode = cropCode
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserCode (state, userCode) {
      state.userCode = userCode
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data).then(res => {
          commit('setToken', res.data.token)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    getMenuInfo ({ state, commit, dispatch }) {
      return new Promise((resolve, reject) => {
        try {
          getMenuInfo().then(res => {
            var data = res.data

            commit('setUserName', data.userName)
            commit('setUserId', data.userId)
            commit('setUserCode', data.userCode)
            commit('setCropCode', data.corpCode)

            var access = data.menu.map((item) => {
              return item.resourcesCode
            })

            commit('setAccess', access)
            commit('setHasGetInfo', true)

            resolve(access)

          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
