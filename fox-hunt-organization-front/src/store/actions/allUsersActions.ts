import composeSimpleApiCallingAction from './common/composeSimpleApiCallingAction';
import {
  AllUsersActionTypes,
  BanUnbanActionTypes,
} from './types/allUsersActionTypes';
import { allUsersApi } from '../../api';

export const fetchAllUsers = composeSimpleApiCallingAction(
  AllUsersActionTypes.fetch.request,
  AllUsersActionTypes.fetch.success,
  AllUsersActionTypes.fetch.failure,
  async function () {
    return await allUsersApi.getAll();
  },
);

export const setUserBan = composeSimpleApiCallingAction(
  BanUnbanActionTypes.fetch.request,
  BanUnbanActionTypes.fetch.success,
  BanUnbanActionTypes.fetch.failure,
  async function (id: number) {
    return await allUsersApi.banUnban(id);
  },
);
