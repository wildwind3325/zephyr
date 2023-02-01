import request from '../util/request';

export const login = (account, password) => {
  return request({
    method: 'POST',
    url: '/api/anonymous?_module=login&_action=login',
    data: {
      account: account,
      password: password
    }
  });
};

export const loginByFeishu = code => {
  return request({
    method: 'POST',
    url: '/api/anonymous?_module=login&_action=loginByFeishu',
    data: { code: code }
  });
};

export const logout = () => {
  return request({
    method: 'POST',
    url: '/api/anonymous?_module=login&_action=logout'
  });
};

export const status = () => {
  return request({
    method: 'POST',
    url: '/api/common?_module=login&_action=status'
  });
};