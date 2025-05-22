import { PaginationAction } from '../../types/Actions';
import { PaginationState } from '../../types/States';

const initialState: PaginationState = {
  pageNumber: 0,
  pageSize: 8,
  emptyRows: 0,
  allItems: [],
};

export default function paginationReducer(
  state = initialState,
  action: PaginationAction,
): PaginationState {
  function calculateEmptyRows(action: PaginationAction) {
    const optimalRecordCount = 8;
    const pageSize = action.payload.pageSize;
    const pageNumber = action.payload.pageNumber;
    const rowsLength = action.payload.allItems.length;
    const lastPage = Math.floor(rowsLength / pageSize);

    if (pageSize === -1 || rowsLength < pageSize) {
      return 0;
    } else if (pageSize < optimalRecordCount && lastPage !== pageNumber) {
      return optimalRecordCount - pageSize;
    } else if (pageSize < optimalRecordCount && lastPage === pageNumber) {
      return optimalRecordCount - (rowsLength % pageSize);
    } else {
      return pageSize - Math.min(pageSize, rowsLength - pageNumber * pageSize);
    }
  }
  switch (action.type) {
    case 'CHANGE_PAGE': {
      const emptyRows = calculateEmptyRows(action);
      return {
        pageNumber: action.payload.pageNumber,
        pageSize: action.payload.pageSize,
        emptyRows,
        allItems: action.payload.allItems,
      };
    }
    case 'INIT_PAGINATION':
      return initialState;
    default:
      return state;
  }
}
