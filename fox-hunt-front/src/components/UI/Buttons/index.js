import { Button } from '@mui/material';
import SortIconButton from './SortIconButton';
import withConstantProps from '../../../hocs/withConstantProps';

export const IconButton = withConstantProps({
  variant: 'link',
})(Button);

export const SortIconNumericButton = withConstantProps({
  baseSortTypeClassName: 'fa-sort-numeric',
})(SortIconButton);

export { SortIconButton };
