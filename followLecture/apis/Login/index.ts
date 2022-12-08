import { request } from '@apis/index';
import { IPostLoginReq } from './type/schema';

export const getLogin = () => {
  return request.get('/api/users').then((res) => res.data);
};

export const postLogin = (data: IPostLoginReq) => {
  return request.post('/api/users/login', data);
};
