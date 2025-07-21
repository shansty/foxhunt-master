import { ReactNode } from 'react';
import { CircularProgress, Box } from '@mui/material';

export interface LoaderProps {
  children: ReactNode | ReactNode[];
  isLoading: boolean;
  size?: number;
  thickness?: number;
}

export const Loader = ({
  children,
  isLoading,
  size,
  thickness,
}: LoaderProps) => {
  return (
    <>
      {isLoading ? (
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        >
          <CircularProgress size={size} thickness={thickness} />
        </Box>
      ) : (
        children
      )}
    </>
  );
};
