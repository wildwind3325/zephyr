import request from '../../util/request';

export const list = (module, category, keyword, from, to, pageNumber) => {
  return request({
    method: 'POST',
    url: '/api/common?_module=system.log&_action=list',
    data: {
      module: module,
      category: category,
      keyword: keyword,
      from: from,
      to: to,
      pageSize: 8,
      pageNumber: pageNumber
    }
  });
};