import { useState } from 'react';

export default function useLocationClonePopUp() {
  const [isOpenLocationClonePopUp, setOpenLocationClonePopUp] =
    useState<boolean>(false);

  const showLocationClonePopUp = () => {
    setOpenLocationClonePopUp(true);
  };

  const closeLocationClonePopUp = () => {
    setOpenLocationClonePopUp(false);
  };

  return {
    isOpenLocationClonePopUp,
    showLocationClonePopUp,
    closeLocationClonePopUp,
  };
}
