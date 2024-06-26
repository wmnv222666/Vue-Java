/** Date: 2018/11/9 ; Author: 姜啸 **/
import {
  getBreadCrumbList,
  getMenuByRouter,
  getHomeRoute,
  localSave,
  localRead,
  setTagNavListInLocalstorage,
  getTagNavListFromLocalstorage,
  getRouteTitleHandled,
  getNextRoute,
  routeHasExist,
  routeEqual
} from '@/libs/utils'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers, homeName),
    local: localRead('xlocal'),
    isCollapse: localRead('collapse') === 'true'
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access),
    isCollapse: state => state.isCollapse
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setLocal (state, lang) {
      localSave('xlocal', lang)
      state.local = lang
    },
    setMenuCollapsed (state, collapse) {
      localSave('collapse', collapse)
      state.isCollapse = collapse
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    }
  },
  actions: {
    SET_LOCAL_LANG ({ state, commit }, name) {
      return new Promise((resolve, reject) => {
        try {
          commit('setLocal', name)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
