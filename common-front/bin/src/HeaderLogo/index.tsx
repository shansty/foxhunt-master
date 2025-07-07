import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import projectLogo from '../sharedFiles/images/fox.svg';

export interface HeaderLogoProps {
  portalName: string;
}

export function HeaderLogo({ portalName }: HeaderLogoProps) {
  const portalTitle = portalName ? `${portalName} portal` : 'Portal logo';

  return (
    <div className={clsx('app-header-logo', {})}>
      <Box className="header-logo-wrapper" title={portalTitle}>
        <Link
          aria-label="icon-link"
          className="header-logo-wrapper-link"
          to={'/'}
        >
          <IconButton
            className="header-logo-wrapper-btn"
            color="primary"
            size="medium"
          >
            <img
              alt={portalTitle}
              className="app-header-logo-img"
              src={projectLogo}
            />
          </IconButton>
        </Link>
        <Box className="header-logo-text">{portalName}</Box>
      </Box>
    </div>
  );
}
