import { styled } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const StyledWarningIcon = styled(WarningIcon)(({ theme }) => ({
  fill: theme.palette.warning.main,
  marginRight: theme.spacing(1),
}));

export default StyledWarningIcon;
