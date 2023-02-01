import request from '../../util/request';

export const list = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.user&_action=list',
    data: form
  });
};

export const add = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.user&_action=add',
    data: form
  });
};

export const edit = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.user&_action=edit',
    data: form
  });
};

export const remove = id => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.user&_action=remove',
    data: { id: id }
  });
};