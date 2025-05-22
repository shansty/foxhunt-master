import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function AvatarCropper(props) {
  const { image, setImageRef, setCrop, crop } = props;

  const onImageLoaded = React.useCallback(
    (image) => {
      setImageRef(image);
    },
    [setImageRef],
  );

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  return (
    <Container
      sx={{
        maxWidth: '600px',
        maxHeight: '600px',
        mt: 1,
      }}
    >
      <ReactCrop
        src={image}
        crop={crop}
        circularCrop={true}
        keepSelection={true}
        minWidth={120}
        minHeight={120}
        onImageLoaded={onImageLoaded}
        onChange={onCropChange}
      />
    </Container>
  );
}

AvatarCropper.propTypes = {
  image: PropTypes.string,
};

export default AvatarCropper;
