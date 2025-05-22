import React, { useEffect, useState } from 'react';
import { Button, Paper, TableBody, TableContainer } from '@mui/material';
import { TableHeader, useIsMobile } from 'common-front';
import { StyledTable } from './styles';
import {
  DELETE_TOOLTIP_TEXT,
  DELETE_TOOLTIP_TITLE,
} from '../../../constants/alertConst';
import {
  removeTooltip as deleteTooltip,
  getTooltips,
} from '../../../store/actions/tooltipsActions';
import {
  selectAllTooltips,
  selectNotCreatedTooltips,
} from '../../../store/selectors/tooltipsSelectors';
import AlertDialog from '../../../components/AlertDialog';
import { useDispatch, useSelector } from 'react-redux';
import CreateTooltipForm from './CreateTooltipForm/CreateTooltipForm';
import TooltipTableRow from './TooltipTableRow/TooltipTableRow';

const initialEmptyTooltip = {
  code: '',
  message: '',
};

const DIALOG_TITLE = 'Create a Tooltip';

function ListTooltips() {
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [chosenTooltip, setChosenTooltip] = useState(null);
  const [isLineCreated, setLineCreated] = useState(false);

  const tooltips = useSelector(selectAllTooltips);
  const notCreatedTooltips = useSelector(selectNotCreatedTooltips);
  const isCreationPossible = notCreatedTooltips.length > 0 && !isLineCreated;
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTooltips());
  }, [dispatch]);

  const getActionItems = (tooltip) => [
    {
      id: tooltip.id,
      title: 'Details',
      to: '#',
      onClick: () => createEditLine(tooltip),
    },
    {
      id: tooltip.id,
      title: 'Remove',
      to: '#',
      onClick: () => showAlertDialog(tooltip),
    },
  ];

  const removeTooltip = (id) => {
    dispatch(deleteTooltip(id));
    closeAlertDialog();
  };

  const showAlertDialog = (tooltip) => {
    setChosenTooltip(tooltip);
    setAlertOpen(true);
  };

  const closeAlertDialog = () => {
    setAlertOpen(false);
    setChosenTooltip(null);
  };

  const addCreationLine = () => {
    setChosenTooltip(initialEmptyTooltip);
    setLineCreated(true);
  };

  const deleteCreationLine = () => {
    setLineCreated(false);
  };

  const createEditLine = (tooltip) => {
    setChosenTooltip(tooltip);
    setLineCreated(false);
  };

  const destroyEditLine = () => {
    setChosenTooltip(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <StyledTable aria-label="custom table">
          <TableHeader
            headerCells={[
              { name: '#' },
              { name: isMobile ? 'Code & message' : 'Code' },
              { name: 'Message', hideOnMobile: true },
              { name: 'Operation' },
            ]}
          />
          <TableBody>
            {tooltips.map((tooltip, index) =>
              tooltip.id === chosenTooltip?.id && !isAlertOpen ? (
                <CreateTooltipForm
                  key={tooltip.id}
                  tooltip={chosenTooltip}
                  index={++index}
                  deleteLine={destroyEditLine}
                />
              ) : (
                <TooltipTableRow
                  key={tooltip.id}
                  tooltip={tooltip}
                  index={index}
                  getActionItems={getActionItems}
                />
              ),
            )}
            {isLineCreated && (
              <CreateTooltipForm
                tooltip={chosenTooltip}
                index={tooltips.length + 1}
                deleteLine={deleteCreationLine}
              />
            )}
          </TableBody>
        </StyledTable>
        {isCreationPossible && (
          <Button color="primary" onClick={addCreationLine} sx={{ margin: 2 }}>
            + {DIALOG_TITLE}
          </Button>
        )}
        <AlertDialog
          open={isAlertOpen}
          onClose={closeAlertDialog}
          title={DELETE_TOOLTIP_TITLE}
          text={DELETE_TOOLTIP_TEXT}
          onSubmit={() => removeTooltip(chosenTooltip.id)}
        />
      </TableContainer>
    </>
  );
}

export default ListTooltips;
