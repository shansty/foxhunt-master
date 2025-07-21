import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Button from '@mui/material/Button';

function FormDialog(props) {
  const { open, handleClose, title, children } = props;

  const renderButtons = (handleSubmit, cancelButtonName, confirmButtonName) => (
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        {cancelButtonName}
      </Button>
      <Button type="submit" onClick={handleSubmit} color="primary">
        {confirmButtonName}
      </Button>
    </DialogActions>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>{children(renderButtons)}</DialogContent>
    </Dialog>
  );
}

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default FormDialog;
