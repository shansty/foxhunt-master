import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllHelpContents } from 'src/store/selectors/helpContentSelector';
import {
  getHelpContents,
  removeHelpContentArticle,
  removeHelpContentTopic,
  updateAllHelpContents,
} from 'src/store/actions/helpContentActions';
import { PageTitle, DropdownMenu, TableHeader } from 'common-front';
import { Paper, styled, Table, TableBody, TableCell } from '@mui/material';
import ExpandableDragAndDropTableRow from 'src/components/ExpandableDragAndDropTableRow';
import HelpContentArticlesTable from 'src/components/HelpContentArticlesTable';
import Button from '@mui/material/Button';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Grid from '@mui/material/Grid';
import CreateTopicModal from 'src/components/HelpContentCreateModal/CreateTopicModal';
import CreateArticleModal from 'src/components/HelpContentCreateModal/CreateArticleModal';
import AlertDialog from 'src/components/AlertDialog';
import {
  DELETE_HELP_CONTENT_ARTICLE_TEXT,
  DELETE_HELP_CONTENT_ARTICLE_TITLE,
  DELETE_HELP_CONTENT_TOPIC_TEXT,
  DELETE_HELP_CONTENT_TOPIC_TITLE,
} from 'src/constants/alertConst';
import FormDialog from 'src/components/FormDialog';
import { parseEditorText } from 'src/utils/textEditorUtils';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';

const TitleCell = styled(TableCell)({
  maxWidth: 80,
  minWidth: 80,
});

const DescriptionCell = styled(TableCell)({
  maxWidth: 500,
  minWidth: 500,
});

const OperationsCell = styled(TableCell)({
  maxWidth: 100,
  minWidth: 100,
});

const HelpContentManagementPage = () => {
  const dispatch = useDispatch();
  const helpContents = useSelector(selectAllHelpContents);
  const title = 'Help content management';
  const description = 'Create and update Help content';
  const defaultArticle = { title: '', contents: null, notes: '' };
  const defaultTopic = { title: '', contents: null, notes: '' };

  const [helpContentsState, setHelpContentsState] = useState(helpContents);
  const [isSaveEnabled, setSaveEnabled] = useState(false);
  const [isArticleModelOpen, setArticleModalOpen] = useState(false);
  const [isTopicModalOpen, setTopicModalOpen] = useState(false);
  const [isArticleAlertDialogOpen, setArticleDialogOpen] = useState(false);
  const [isTopicAlertDialogOpen, setTopicDialogOpen] = useState(false);
  const [updatedArticle, setUpdatedArticle] = useState(defaultArticle);
  const [updatedTopic, setUpdatedTopic] = useState(defaultTopic);
  const topicModalTitle = updatedTopic?.index ? 'Update topic' : 'Create topic';
  const articleModalTitle = updatedArticle?.title
    ? 'Update article'
    : 'Create article';

  useEffect(() => {
    if (!isSaveEnabled) {
      setHelpContentsState(helpContents);
    }
  }, [helpContents, isSaveEnabled]);

  useEffect(() => {
    dispatch(getHelpContents());
  }, [dispatch]);

  const reorderArrayElementsAndIndices = (array, startIndex, endIndex) => {
    const [removed] = array.splice(startIndex - 1, 1);
    array.splice(endIndex - 1, 0, removed);
    return array.map((topic, index) => ({ ...topic, index: ++index }));
  };

  const enableSaveOrder = () => {
    if (!isSaveEnabled) {
      setSaveEnabled(true);
    }
  };

  const onArticlesDragEnd = (result) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    if (startIndex === endIndex) return;

    const topicIndex = result.destination.droppableId;

    const topics = [...helpContentsState];
    const topic = topics[topicIndex - 1];
    const articles = [...topic.articles];

    topic.articles = reorderArrayElementsAndIndices(
      articles,
      startIndex,
      endIndex,
    );
    topics[topicIndex - 1] = topic;

    setHelpContentsState(topics);
    enableSaveOrder();
  };

  const onTopicsDragEnd = (result) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    if (startIndex === endIndex) return;

    const content = [...helpContentsState];

    const reordered = reorderArrayElementsAndIndices(
      content,
      startIndex,
      endIndex,
    );
    setHelpContentsState(reordered);
    enableSaveOrder();
  };

  const saveNewOrder = () => {
    if (isSaveEnabled) {
      dispatch(updateAllHelpContents(helpContentsState));
      setSaveEnabled(false);
    }
  };

  const closeTopicModal = () => {
    setTopicModalOpen(false);
    setUpdatedTopic(defaultTopic);
  };

  const openCreateTopicModal = () => {
    setTopicModalOpen(true);
  };

  const closeArticleModal = () => {
    setArticleModalOpen(false);
    setUpdatedTopic(defaultTopic);
    setUpdatedArticle(defaultArticle);
  };

  const openCreateArticleModal = (topic) => {
    setUpdatedTopic(topic);
    setArticleModalOpen(true);
  };

  const updateTopic = (topic) => {
    setUpdatedTopic(topic);
    openCreateTopicModal();
  };

  const updateArticle = (article, topic) => {
    setUpdatedArticle(article);
    openCreateArticleModal(topic);
  };

  const closeAlertDialog = () => {
    setArticleDialogOpen(false);
    setTopicDialogOpen(false);
    setUpdatedArticle(defaultArticle);
    setUpdatedTopic(defaultTopic);
  };

  const openRemoveTopicDialog = (topic) => {
    setUpdatedTopic(topic);
    setTopicDialogOpen(true);
  };

  const openRemoveArticleDialog = (article) => {
    setUpdatedArticle(article);
    setArticleDialogOpen(true);
  };

  const removeTopic = () => {
    saveNewOrder();
    dispatch(removeHelpContentTopic(updatedTopic.id));
    closeAlertDialog();
  };

  const removeArticle = () => {
    saveNewOrder();
    dispatch(removeHelpContentArticle(updatedArticle.id));
    closeAlertDialog();
  };

  const getDropdownMenuItems = (topic) => [
    {
      id: topic.id,
      title: 'Add Article',
      to: '#',
      onClick: () => openCreateArticleModal(topic),
    },
    {
      id: topic.id,
      title: 'Update',
      to: '#',
      onClick: () => updateTopic(topic),
    },
    {
      id: topic.id,
      title: 'Remove',
      to: '#',
      onClick: () => openRemoveTopicDialog(topic),
    },
  ];

  return (
    <MainLayout>
      <PageTitle titleHeading={title} titleDescription={description} />
      <Grid item container direction={'column'} spacing={2}>
        <Grid
          item
          container
          direction={'row'}
          justifyContent="space-between"
          spacing={1}
        >
          <Grid item>
            <Button
              variant={'contained'}
              disabled={!isSaveEnabled}
              color={'primary'}
              onClick={saveNewOrder}
            >
              Update order
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={openCreateTopicModal}
            >
              Add Topic
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <DragDropContext onDragEnd={onTopicsDragEnd}>
            <Droppable droppableId={'topics'}>
              {(provided) => (
                <Paper>
                  <Table sx={{ minWidth: 650 }} ref={provided.innerRef}>
                    <TableHeader
                      headerCells={[
                        {},
                        { name: 'Title' },
                        { name: 'Contents' },
                        {},
                      ]}
                    />
                    <TableBody>
                      {helpContentsState.map((topic) => (
                        <Draggable
                          key={topic.index}
                          draggableId={topic.index.toString()}
                          index={topic.index}
                        >
                          {(provided) => (
                            <ExpandableDragAndDropTableRow
                              key={topic.id}
                              expandComponent={
                                <HelpContentArticlesTable
                                  topic={topic}
                                  onDragEnd={onArticlesDragEnd}
                                  updateArticle={updateArticle}
                                  openRemoveDialog={openRemoveArticleDialog}
                                />
                              }
                              provided={provided}
                            >
                              <TitleCell align={'justify'}>
                                {topic.title}
                              </TitleCell>
                              <DescriptionCell align={'justify'}>
                                {parseEditorText(topic.contents)}
                              </DescriptionCell>
                              <OperationsCell align={'center'}>
                                <DropdownMenu
                                  items={getDropdownMenuItems(topic)}
                                />
                              </OperationsCell>
                              {provided.placeholder}
                            </ExpandableDragAndDropTableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>

        <FormDialog
          open={isTopicModalOpen}
          handleClose={closeTopicModal}
          title={topicModalTitle}
        >
          {(renderButtons) => (
            <CreateTopicModal
              topic={updatedTopic}
              saveOrderChanges={saveNewOrder}
              helpContents={helpContents}
              renderButtons={renderButtons}
              handleClose={closeTopicModal}
            />
          )}
        </FormDialog>

        <FormDialog
          open={isArticleModelOpen}
          handleClose={closeArticleModal}
          title={articleModalTitle}
        >
          {(renderButtons) => (
            <CreateArticleModal
              handleClose={closeArticleModal}
              article={updatedArticle}
              topic={updatedTopic}
              saveOrderChanges={saveNewOrder}
              renderButtons={renderButtons}
            />
          )}
        </FormDialog>

        <AlertDialog
          open={isTopicAlertDialogOpen}
          onClose={closeAlertDialog}
          title={DELETE_HELP_CONTENT_TOPIC_TITLE}
          text={DELETE_HELP_CONTENT_TOPIC_TEXT}
          onSubmit={removeTopic}
        />
        <AlertDialog
          open={isArticleAlertDialogOpen}
          onClose={closeAlertDialog}
          title={DELETE_HELP_CONTENT_ARTICLE_TITLE}
          text={DELETE_HELP_CONTENT_ARTICLE_TEXT}
          onSubmit={removeArticle}
        />
      </Grid>
    </MainLayout>
  );
};

export default signInRequired(HelpContentManagementPage);
