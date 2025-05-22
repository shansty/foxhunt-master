import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Location } from 'src/types/Location';
import { toggleFavoriteLocation } from 'src/store/actions/locationsActions';

export default function useFavoriteLocation(location: Location) {
  const [starSelected, setStarSelected] = useState<boolean>(false);
  const dispatch = useDispatch();
  const toggleFavIcon = () => {
    dispatch(toggleFavoriteLocation(location));
    setStarSelected((starSelected) => !starSelected);
  };

  useEffect(() => {
    if (location.isFavorite) {
      setStarSelected(true);
    } else {
      setStarSelected(false);
    }
  }, [location]);

  return {
    starSelected,
    toggleFavIcon,
  };
}
