import request from '../util/request';

export const login = code => {
  return request({
    method: 'POST',
    url: '/api/login?_action=login',
    data: { code: code }
  });
};

export const logout = () => {
  return request({
    method: 'POST',
    url: '/api/login?_action=logout'
  });
};

export const status = () => {
  return request({
    method: 'POST',
    url: '/api/login?_action=status'
  });
};