import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { ModalProps } from '@mui/material';

export interface AlertDialogProps {
  open: ModalProps['open'];
  onClose: () => void;
  title?: string;
  text?: string;
  onSubmit: () => void;
  content?: string;
  hideControls?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

function AlertDialog(props: AlertDialogProps) {
  const {
    open,
    onClose,
    title,
    text,
    onSubmit,
    content,
    hideControls,
    fullWidth,
    children,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const onSubmitClick = () => {
    onSubmit();
  };

  return (
    <Dialog
      open={open}
      fullWidth={fullWidth}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-testid="alert-dialog"
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      <DialogContent>
        {text && (
          <DialogContentText mb={1} id="alert-dialog-description">
            {text}
          </DialogContentText>
        )}
        {content}
        {children}
      </DialogContent>
      {!hideControls && (
        <DialogActions>
          <Button onClick={handleClose} color={'primary'}>
            Cancel
          </Button>
          <Button onClick={onSubmitClick} color={'primary'} autoFocus>
            Ok
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default AlertDialog;
