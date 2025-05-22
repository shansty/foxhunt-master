import { styled } from '@mui/material/styles';
import { TableCell, Table } from '@mui/material';
import Grid from '@mui/material/Grid';

export const ActionCell = styled(TableCell)(({ theme }) => ({
  width: '20%',
  verticalAlign: 'middle',
  [theme.breakpoints.down('sm')]: {
    width: '30%',
  },
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 500,
  [theme.breakpoints.down('sm')]: {
    minWidth: 100,
  },
}));

export const CodeCell = styled(TableCell)(({ theme }) => ({
  width: '40%',
  [theme.breakpoints.down('sm')]: {
    width: '65%',
    wordBreak: 'break-all',
  },
}));

export const StyledGrid = styled(Grid)({
  width: '100%',
  wordBreak: 'break-all',
});
