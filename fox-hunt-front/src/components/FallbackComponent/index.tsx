import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';

import { buildWelcomePageUrl } from 'src/api/utils/navigationUtil';
import { DIV_CLASS_NAME, HEADING_CLASS_NAME } from './styles';
import illustration from 'src/theme/assets/images/illustrations/fallback.svg';

export interface FallbackComponentProps {
  resetErrorBoundary: () => void;
  sx?: any;
}

const FallbackComponent = ({
  resetErrorBoundary,
  sx,
}: FallbackComponentProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(buildWelcomePageUrl());
    resetErrorBoundary();
  };

  return (
    <Box className={DIV_CLASS_NAME}>
      <img
        alt="fallback"
        src={illustration}
        className="w-15 mx-auto d-block img-fluid"
      />
      <h3 className={HEADING_CLASS_NAME}>
        Oops! Something went wrong... <br />
        Brace yourself till we get error fixed.
      </h3>
      <div className="text-center">
        <Button variant="contained" color="primary" onClick={handleClick}>
          Back to the app
        </Button>
      </div>
    </Box>
  );
};

export default FallbackComponent;
