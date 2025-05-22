import React, { useEffect, useState } from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { useIsMobile } from '../index';

export interface CellProps {
  active?: boolean;
  enableSorting?: boolean;
  hideOnMobile?: boolean;
  name: string;
}
export interface TableHeaderProps {
  direction?: 'asc' | 'desc';
  headerCells: CellProps[];
  sortingHandler?: (argument: any) => void;
}

export function TableHeader({
  direction,
  headerCells,
  sortingHandler,
}: TableHeaderProps) {
  const isMobile = useIsMobile();
  const [activeCell, setActiveCell] = useState<string>('');

  useEffect(() => {
    headerCells.map((cell: CellProps) => {
      cell.active && setActiveCell(cell.name);
    });
  }, []);

  const handleSort = (cellName: string) => () => {
    setActiveCell(cellName);
    const isSameOrder = activeCell === cellName && direction === 'asc';
    const currentOrder = isSameOrder ? 'desc' : 'asc';
    sortingHandler?.({
      orderBy: cellName,
      order: currentOrder,
    });
  };

  const renderSortingLabel = (cell: CellProps) => {
    if (!cell.enableSorting) return cell.name;
    else
      return (
        <TableSortLabel
          active={cell.name === activeCell}
          direction={direction}
          onClick={handleSort(cell.name)}
        >
          {cell.name}
        </TableSortLabel>
      );
  };

  return (
    <TableHead>
      <TableRow>
        {headerCells.map((cell: CellProps) => (
          <TableCell
            align={'justify'}
            key={`col_${cell.name}`}
            hidden={!!isMobile && !!cell.hideOnMobile}
          >
            {renderSortingLabel(cell)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
