import request from '../../util/request';

export const list = () => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.role&_action=list'
  });
};

export const add = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.role&_action=add',
    data: form
  });
};

export const edit = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.role&_action=edit',
    data: form
  });
};

export const remove = id => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.role&_action=remove',
    data: { id: id }
  });
};