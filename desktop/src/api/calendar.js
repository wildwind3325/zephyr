import request from '../util/request';

export const list = pageNumber => {
  return request({
    method: 'POST',
    url: '/api/common?_module=calendar&_action=list',
    data: {
      pageSize: 8,
      pageNumber: pageNumber
    }
  });
};

export const add = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=calendar&_action=add',
    data: form
  });
};

export const edit = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=calendar&_action=edit',
    data: form
  });
};

export const remove = id => {
  return request({
    method: 'POST',
    url: '/api/common?_module=calendar&_action=remove',
    data: { id: id }
  });
};