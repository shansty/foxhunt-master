import React from 'react';
import { makeStyles } from '@mui/styles';
import { formatDateAndTime } from 'src/utils';
import { PageTitle, FavIcon } from 'common-front';
import { Location } from 'src/types/Location';
import useFavoriteLocation from '../hooks/useFavoriteLocation';

export interface ExistingLocationPageTitleProps {
  location: Location;
  isFavLocationFeatureEnabled: boolean;
}

const useStyles = makeStyles({
  updatedBy: {
    fontWeight: 'bold',
    display: 'inline-block',
  },
});

const ExistingLocationPageTitle = ({
  location,
  isFavLocationFeatureEnabled,
}: ExistingLocationPageTitleProps) => {
  const classes = useStyles();
  const updatedAt = location.updatedDate
    ? formatDateAndTime(location.updatedDate)
    : formatDateAndTime(location.createdDate);
  const updatedBy = location.updatedBy
    ? `${location.updatedBy.firstName} ${location.updatedBy.lastName}`
    : `${location.createdBy?.firstName} ${location.createdBy?.lastName}`;
  const description = `Last modification: ${updatedAt} by `;
  const title = `Location: ${location.name}`;
  const { starSelected, toggleFavIcon } = useFavoriteLocation(location);

  return (
    <PageTitle
      titleContent={
        <>
          {title}
          {isFavLocationFeatureEnabled && (
            <FavIcon handleToggle={toggleFavIcon} starSelected={starSelected} />
          )}
        </>
      }
      descriptionContent={
        <>
          {description}
          <div className={classes.updatedBy}>{updatedBy}</div>
        </>
      }
    />
  );
};

export default ExistingLocationPageTitle;
