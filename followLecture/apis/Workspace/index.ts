import { IChannel, IWorkspace } from '@pages/typings/db';
import { request } from '@apis/index';
import { IPostChannel, IPostWorkSpace } from './type/shema';

export const postWorkSpace = (workspace: IPostWorkSpace) => {
  return request.post<IWorkspace>('/api/workspaces', workspace);
};

export const postChannel = (param: string, data: IPostChannel) => {
  return request.post(`/api/workspaces/${param}/channels`, data);
};

export const getChannel = (param?: string) => {
  return request.get<IChannel[]>(`/api/workspaces/${param}/channels`).then((res) => res.data);
};
