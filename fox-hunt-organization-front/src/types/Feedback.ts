import { RootUser } from './RootUser';
import { ISODate } from './ISODate';

export interface Feedback {
  comment: string;
  hasRead: boolean;
  id: number;
  ranking: number;
  sendDate: ISODate;
  user: RootUser;
}

interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  unpaged: boolean;
}

interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Feedbacks {
  content: Feedback[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}
