import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';

import AlertDialog from '../AlertDialog';

const IconPopupDialog = ({ children, icon }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const closeMap = () => setIsMapOpen(false);
  const openMap = () => setIsMapOpen(true);

  return (
    <>
      <Tooltip arrow title="Open the map" placement="right">
        <IconButton
          sx={{ mt: 1 }}
          color="primary"
          aria-label="open the map"
          onClick={openMap}
        >
          {icon}
        </IconButton>
      </Tooltip>
      <AlertDialog fullWidth hideControls open={isMapOpen} onClose={closeMap}>
        {children}
      </AlertDialog>
    </>
  );
};

export default IconPopupDialog;
