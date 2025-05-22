import { useState } from 'react';

export default function useAlertDialog() {
  const [isOpenAlertDialog, setOpenAlertDialog] = useState<boolean>(false);

  const showAlertDialog = () => {
    setOpenAlertDialog(true);
  };

  const closeAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  return {
    isOpenAlertDialog,
    showAlertDialog,
    closeAlertDialog,
  };
}
