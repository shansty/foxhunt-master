import React, { useState, useEffect } from 'react';
import { IconButton, TableCell, TableRow } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/EditOutlined';
import DoneIcon from '@mui/icons-material/DoneAllTwoTone';
import RevertIcon from '@mui/icons-material/NotInterestedOutlined';
import { Feature } from '../../../types/Feature';
import { IUpdatedFeature } from '../FeatureManagmentPage';

export interface CustomTableRowProps {
  feature: Feature;
  updateFeature: (feature: IUpdatedFeature) => Promise<any>;
}

const useStyles = makeStyles({
  text: {
    width: 'inherit',
  },
  editCell: {
    width: '100%',
  },
  editIcons: {
    marginLeft: '-10px',
  },
});

const CustomTableRow = ({ feature, updateFeature }: CustomTableRowProps) => {
  const classes = useStyles();
  const [isTextFieldOpen, setIsTextFieldOpen] = useState<boolean>(false);
  const [textFieldValue, setTextFieldValue] = useState<string | null>(null);

  const handleSave = (featureId: number) => {
    if (textFieldValue === null) {
      setIsTextFieldOpen(false);
      return;
    }

    const editedFeature: IUpdatedFeature = {
      description: textFieldValue,
      id: featureId,
    };

    updateFeature(editedFeature);
  };

  const handleCancel = () => {
    setTextFieldValue(null);
    setIsTextFieldOpen(false);
  };

  useEffect(() => {
    setIsTextFieldOpen(false);
  }, [feature]);

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {feature.name}
      </TableCell>

      <TableCell
        component="th"
        scope="row"
        className={isTextFieldOpen ? classes.editCell : ''}
      >
        {isTextFieldOpen ? (
          <TextField
            id="textarea-description"
            name="description"
            multiline
            defaultValue={feature.description}
            onChange={(e) => setTextFieldValue(e.target.value)}
            className={classes.text}
          />
        ) : (
          feature.description
        )}
      </TableCell>

      <TableCell component="th" scope="row">
        {isTextFieldOpen ? (
          <>
            <IconButton
              aria-label="save"
              className={classes.editIcons}
              onClick={() => handleSave(feature.id)}
              size="large"
            >
              <DoneIcon />
            </IconButton>

            <IconButton
              className={classes.editIcons}
              aria-label="revert"
              onClick={handleCancel}
              size="large"
            >
              <RevertIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            className={classes.editIcons}
            aria-label="edit"
            onClick={() => setIsTextFieldOpen(true)}
            size="large"
          >
            <EditIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};
export default CustomTableRow;
