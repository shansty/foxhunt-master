import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';

export interface DropdownMenuItem {
  action?: () => void;
  id: number;
  title: string;
  to?: string;
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
}

export function DropdownMenu({ items }: DropdownMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    items.length > 0 && setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function itemClickHandler(action?: Function) {
    handleClose();
    action && action();
  }

  return (
    <>
      <IconButton
        aria-label="icon-button"
        className="text-center"
        color="primary"
        onClick={handleClick}
        size="small"
      >
        <MoreHoriz />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        onClose={handleClose}
        open={!!anchorEl}
        sx={{ width: 300 }}
      >
        {items?.map((item: DropdownMenuItem) => (
          <MenuItem
            component={Link}
            key={item.id + item.title}
            onClick={itemClickHandler.bind(this, item.action)}
            to={item.to ? item.to : '#'}
          >
            <Typography variant="inherit" noWrap>
              {item.title}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
