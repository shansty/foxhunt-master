import { Badge } from '@mui/material';
import { styled } from '@mui/styles';

import vars from 'src/theme/assets/core/_variables-mui.module.scss';

export const AvatarBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    width: '100%',
    color: `${vars.inheritDefault1}`,
    background:
      'radial-gradient(ellipse at 50% -140%, rgba(143, 143, 143, 0.7) 70%, transparent 72%)',
    top: '78%',
    right: '50%',
    fontSize: '10px',
  },
});
