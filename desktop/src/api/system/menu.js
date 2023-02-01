import request from '../../util/request';

export const list = () => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.menu&_action=list'
  });
};

export const add = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.menu&_action=add',
    data: form
  });
};

export const edit = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.menu&_action=edit',
    data: form
  });
};

export const remove = id => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.menu&_action=remove',
    data: { id: id }
  });
};

export const init = () => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.menu&_action=init'
  });
};