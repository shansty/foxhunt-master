import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import _ from 'lodash';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DropdownMenu } from 'common-front';
import { parseEditorText } from '../../utils/textEditorUtils';
import { topicShape } from '../HelpContentCreateModal/propShapes';

const styles = {
  description: {
    maxWidth: 500,
    minWidth: 500,
  },
  title: {
    maxWidth: 80,
    minWidth: 80,
  },
  operations: {
    maxWidth: 100,
    minWidth: 100,
  },
  checkbox: {
    maxWidth: 50,
    minWidth: 50,
  },
};

const HelpContentArticlesTable = (props) => {
  const { topic, onDragEnd, updateArticle, openRemoveDialog } = props;
  const { articles } = topic;

  const getAllDropdownItems = (article) => [
    {
      id: article.id,
      title: 'Update',
      to: '#',
      onClick: () => updateArticle(article, topic),
    },
    {
      id: article.id,
      title: 'Remove',
      to: '#',
      onClick: () => openRemoveDialog(article),
    },
  ];

  if (_.isEmpty(articles)) {
    return (
      <td colSpan="5">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell padding="checkbox" sx={styles.checkbox} />
              <TableCell colSpan={5}>
                There are currently no description blocks
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </td>
    );
  }
  return (
    <td colSpan="5">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={topic.index.toString()}>
          {(provided) => (
            <Table ref={provided.innerRef}>
              <TableBody>
                {articles.map((article) => (
                  <Draggable
                    key={article.index}
                    draggableId={article.index.toString()}
                    index={article.index}
                  >
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TableCell padding="checkbox" />
                        <TableCell sx={styles.title} align={'justify'}>
                          {article.title}
                        </TableCell>
                        <TableCell sx={styles.description} align={'justify'}>
                          {parseEditorText(article.contents)}
                        </TableCell>
                        <TableCell align={'center'} sx={styles.operations}>
                          <DropdownMenu items={getAllDropdownItems(article)} />
                        </TableCell>
                        {provided.placeholder}
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
    </td>
  );
};

HelpContentArticlesTable.propTypes = {
  topic: topicShape,
  onDragEnd: PropTypes.func.isRequired,
  updateArticle: PropTypes.func.isRequired,
  openRemoveDialog: PropTypes.func.isRequired,
};

export default HelpContentArticlesTable;
