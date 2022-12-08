import axios from 'axios';
import { ISignUpReq, ISignUpRes } from './type/schema';
import { request } from '@apis/index';

export const postSignUp = (params: ISignUpReq) => {
  return request.post<ISignUpRes>('/api/users', params);
};
