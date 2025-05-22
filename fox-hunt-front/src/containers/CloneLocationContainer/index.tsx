import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { useAppDispatch } from 'src/store/hooks';
import { cloneLocation } from 'src/store/actions/locationsActions';
import { Location } from 'src/types/Location';
import CloneLocationForm from './CloneLocationForm';

export interface CloneLocationContainerProps {
  handleClickClose: () => void;
  isOpen: boolean;
  locationToClone: Location;
}

function CloneLocationContainer(props: CloneLocationContainerProps) {
  const dispatch = useAppDispatch();
  const onSubmit = (values: any) => {
    const location: Location = { ...props.locationToClone };
    location.name = values.name;
    dispatch(cloneLocation(location));
    props.handleClickClose();
  };

  return (
    <div data-testid="location-clone-popup">
      <Dialog
        open={props.isOpen}
        onClose={props.handleClickClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle sx={{ fontSize: (theme) => theme.spacing(2.5) }}>
          <span>Clone a location</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please, enter a name for cloned location:
          </DialogContentText>
          <CloneLocationForm
            onSubmit={onSubmit}
            locationToClone={props.locationToClone}
            handleClickClose={props.handleClickClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CloneLocationContainer;
