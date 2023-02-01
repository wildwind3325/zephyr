import request from '../../util/request';

export const listGroup = () => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.configuration&_action=listGroup'
  });
};

export const addGroup = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.configuration&_action=addGroup',
    data: form
  });
};

export const editGroup = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.configuration&_action=editGroup',
    data: form
  });
};

export const removeGroup = id => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.configuration&_action=removeGroup',
    data: { id: id }
  });
};

export const list = (group_id, keyword) => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.configuration&_action=list',
    data: {
      group_id: group_id,
      keyword: keyword
    },
    headers: { 'Spin': 'false' }
  });
};

export const add = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.configuration&_action=add',
    data: form
  });
};

export const edit = form => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.configuration&_action=edit',
    data: form
  });
};

export const remove = id => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.configuration&_action=remove',
    data: { id: id }
  });
};