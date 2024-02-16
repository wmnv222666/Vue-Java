import request from './api.request'

export function login (data) {
  return request({
    url: 'login',
    method: 'post',
    data: {
      password: data.password,
      userCode: data.userName,
      corpCode: data.corpCode
    }
  })
}

export function logout (token) {
  return request({
    url: 'permission/logout',
    method: 'post'
  })
}

export function getMenuInfo () {
  return request({
    url: 'auth/get_plant_menu',
    method: 'get',
    params: {
      resourcesType: 0
    }
  })
}
