import React, { useRef } from 'react';
import _ from 'lodash';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { TableHeader } from 'common-front';

const DragDropTableRow = (props) => {
  const headRef = useRef(null);
  const { onDragEnd, rowsData, columns, disabled } = props;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <Table ref={provided.innerRef}>
            <TableHeader headerCells={columns} ref={headRef} />
            <TableBody>
              {rowsData.map((rowData, rowDataIndex) => (
                <Draggable
                  isDragDisabled={disabled}
                  key={`row_${rowData.draggableId}`}
                  draggableId={`${rowData.draggableId}`}
                  index={rowDataIndex}
                >
                  {(provided) => (
                    <TableRow
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {Object.keys(_.omit(rowData, 'draggableId')).map(
                        (rowDataKey, rowColumnIndex) => (
                          <TableCell
                            key={`row_${rowData.draggableId}_data_${rowColumnIndex}`}
                          >
                            {rowData[rowDataKey]}
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </TableBody>
          </Table>
        )}
      </Droppable>
    </DragDropContext>
  );
};

DragDropTableRow.propTypes = {
  onDragEnd: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  rowsData: PropTypes.arrayOf(
    PropTypes.shape({
      draggableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
};

export default DragDropTableRow;
