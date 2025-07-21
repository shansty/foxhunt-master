import { IconButton, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export interface FavIconProps {
  handleToggle: () => void;
  starSelected: boolean;
}

export function FavIcon({ handleToggle, starSelected }: FavIconProps) {
  return (
    <Tooltip title={'Add to Favorite'}>
      <IconButton data-testid="icon-button" onClick={() => handleToggle()}>
        {starSelected ? (
          <StarIcon
            data-testid="filled-star-icon"
            style={{ color: '#ffdd00' }}
          />
        ) : (
          <StarBorderIcon data-testid="bordered-star-icon" />
        )}
      </IconButton>
    </Tooltip>
  );
}
