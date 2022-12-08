import { request } from '@apis/index';

export const postLogout = () => {
  return request.post('/api/users/logout', null);
};
