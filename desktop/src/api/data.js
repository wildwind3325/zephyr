import request from '../util/request';

export const picker = (code, depth) => {
  return request({
    method: 'POST',
    url: '/api/common?_module=data&_action=picker',
    data: {
      code: code,
      depth: depth
    }
  });
};