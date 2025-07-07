import Button from '@mui/material/Button';

export interface CancelButtonProps {
  onClick: () => void;
}
export const CancelButton = ({ onClick }: CancelButtonProps) => (
  <Button variant="contained" color="secondary" onClick={onClick}>
    Cancel
  </Button>
);
