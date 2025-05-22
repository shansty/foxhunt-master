import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  star: {
    color: '#ffdd00',
  },
});

export interface StarRatingComponentProps {
  rating: number;
}

const StarRatingComponent = ({ rating }: StarRatingComponentProps) => {
  const classes = useStyles();
  const fixRating = () => {
    if (rating > 5 || rating < -5) {
      return 5;
    }
    if (rating < 0) {
      return -rating;
    }
    return rating;
  };

  return (
    <>
      {Array.from(Array(fixRating()).keys()).map((index) => (
        <StarIcon key={index} className={classes.star} />
      ))}
    </>
  );
};

export default StarRatingComponent;
