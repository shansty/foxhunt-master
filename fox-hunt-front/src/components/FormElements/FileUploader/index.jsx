import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { getTooBigFileNotification } from '../../../constants/notifyConst';
import { enqueueSnackbar } from '../../../store/actions/notificationsActions';
import { createErrorMessage } from '../../../utils/notificationUtil';

const FILE_UPLOADER_ACCEPTS = Object.freeze({
  IMAGE: 'image/*',
  VIDEO: 'video/*',
  AUDIO: 'audio/*',
});

const FileUploader = ({
  accept,
  onChange,
  disabled,
  label,
  name,
  maxFileSize,
  fileSizeUnit,
  open,
  avatar,
}) => {
  const dispatch = useDispatch();
  const fileInput = useRef(null);

  const handleChange = (event) => {
    const newFile = event.target.files[0];
    event.target.value = '';
    if (validateFile(newFile)) {
      onChange(newFile);
    }
  };

  const validateFile = (file) => {
    if (!file) {
      return false;
    }
    if (maxFileSize && file.size > maxFileSize) {
      dispatch(
        enqueueSnackbar(
          createErrorMessage(
            getTooBigFileNotification(maxFileSize, fileSizeUnit),
            dispatch,
          ),
        ),
      );
      return false;
    }
    return true;
  };

  const deleteFile = () => {
    onChange(null);
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disabled={disabled}
        startIcon={<AddPhotoAlternateIcon />}
        component="span"
        sx={{ mr: 1, mt: 1, mb: 1 }}
        onClick={handleClick}
      >
        {label}
      </Button>
      <input
        ref={fileInput}
        accept={accept}
        type="file"
        name={name}
        disabled={disabled}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {avatar && !open && (
        <Button
          variant="contained"
          color="secondary"
          disabled={disabled}
          startIcon={<DeleteIcon />}
          component="span"
          onClick={deleteFile}
        >
          Delete
        </Button>
      )}
    </>
  );
};

FileUploader.propTypes = {
  accept: PropTypes.oneOf(Object.values(FILE_UPLOADER_ACCEPTS)),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  maxFileSize: PropTypes.number,
  fileSizeUnit: PropTypes.string,
  open: PropTypes.bool,
};

FileUploader.defaultProps = {
  avatar: null,
  disabled: false,
  label: '',
  accept: FILE_UPLOADER_ACCEPTS.IMAGE,
  maxFileSize: 0,
  fileSizeUnit: '',
};

export default FileUploader;
