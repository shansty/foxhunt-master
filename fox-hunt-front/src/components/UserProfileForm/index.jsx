import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import bytes from 'bytes';
import { FormikInput, FormikSimpleAutocomplete } from 'common-front';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import {
  ERRORS,
  FILE_SIZES,
  FIRST_NAME_MIN_LENGTH,
  LAST_NAME_MIN_LENGTH,
  CITY_NAME_MIN_LENGTH,
} from 'src/constants/commonConst';
import { ADMIN } from 'src/constants/roles';
import { selectLoggedUser } from 'src/store/selectors/authSelectors';
import { ENGLISH_LETTERS_ONLY_REGEX } from 'src/utils/validators';
import { DATE_FORMATS } from 'src/constants/dateFormatConstants';
import { countryNames } from 'src/utils/countryNames';
import { user } from 'src/utils/FoxHuntPropTypes';
import DatePickerField from '../Formik/FormikDatePicker';
import FormikMultiSelect from '../Formik/FormikMultiSelect';
import FileUploader from '../FormElements/FileUploader';
import AlertDialog from '../AlertDialog';
import AvatarCropper from '../AvatarCropper';
import { AvatarBadge } from './Badge';
import {
  getBadgeColor,
  getBadgeStatus,
} from 'src/containers/ListUsersContainer/UserTableRow';

const validationSchema = Yup.object().shape({
  lastName: Yup.string()
    .required(ERRORS.REQUIRED_FIELD)
    .max(50, ERRORS.TOO_LONG_DATA)
    .min(LAST_NAME_MIN_LENGTH)
    .matches(ENGLISH_LETTERS_ONLY_REGEX, ERRORS.ACCEPT_ONLY_LETTERS),
  firstName: Yup.string()
    .required(ERRORS.REQUIRED_FIELD)
    .max(50, ERRORS.TOO_LONG_DATA)
    .min(FIRST_NAME_MIN_LENGTH)
    .matches(ENGLISH_LETTERS_ONLY_REGEX, ERRORS.ACCEPT_ONLY_LETTERS),
  dateOfBirth: Yup.date()
    .typeError(ERRORS.MUST_BE_DATE)
    .max(dayjs().add(1, 'minute'), ERRORS.MAX_DATE_OF_BIRTH_MESSAGE)
    .nullable(),
  country: Yup.string().max(255, ERRORS.TOO_LONG_DATA).nullable(),
  city: Yup.string()
    .max(255, ERRORS.TOO_LONG_DATA)
    .min(CITY_NAME_MIN_LENGTH)
    .matches(ENGLISH_LETTERS_ONLY_REGEX, ERRORS.ACCEPT_ONLY_LETTERS),
});

const AVATAR_FIELD_NAME = 'avatarPhoto';
const MAX_AVATAR_FILE_SIZE = 102400;
const MAX_AVATAR_SIZE_READABLE = bytes(MAX_AVATAR_FILE_SIZE, FILE_SIZES.KB);

const UserProfileForm = ({
  avatar,
  cancelEditing,
  initialValues,
  isEdit,
  onSave,
  getEditButton,
  isEditButtonVisible,
  setAvatar,
}) => {
  const [isAvatarCropOpen, setIsAvatarCropOpen] = useState(false);
  const [imageRef, setImageRef] = useState(null);
  const loggedUser = useSelector(selectLoggedUser);
  const avatarButtonLabel = useMemo(
    () => (avatar && !isAvatarCropOpen ? 'Change photo' : 'Upload photo'),
    [avatar, isAvatarCropOpen],
  );
  const navigate = useNavigate();
  const [crop, setCrop] = useState({
    aspect: 1,
    unit: '%',
    width: 50,
    x: 25,
    y: 25,
  });

  const defaultInputProps = useMemo(
    () => ({
      component: TextField,
      disabled: !isEdit,
      enableFeedback: true,
      fullWidth: true,
      variant: 'outlined',
    }),
    [isEdit],
  );

  const handleAvatarChange = (value, setFieldValue) => {
    setFieldValue(AVATAR_FIELD_NAME, value);
    if (!value) {
      setAvatar(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(value);
    setIsAvatarCropOpen(true);
  };

  const cancelAvatarChange = () => {
    setIsAvatarCropOpen(false);
    setAvatar(initialValues.avatarPhoto);
  };

  const createCroppedImage = async (crop) => {
    if (imageRef && crop && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedDataURL(imageRef, crop);
      setAvatar(croppedImageUrl);
      setIsAvatarCropOpen(false);
    }
  };

  const getCroppedDataURL = async (image, crop) => {
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const scaledWidth = crop.width * scaleX;
    const scaledHeight = crop.height * scaleY;

    const ctx = canvas.getContext('2d');

    canvas.width = scaledWidth * pixelRatio;
    canvas.height = scaledHeight * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      scaledWidth,
      scaledHeight,
      0,
      0,
      scaledWidth,
      scaledHeight,
    );

    return canvas.toDataURL('image/jpeg');
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={onSave}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, handleReset, setFieldValue }) => (
          <Card variant={'outlined'}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container direction="column">
                  <Grid item>
                    <Card variant={'outlined'}>
                      <CardContent>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Grid item mb={2}>
                            <Typography className="text-black px-2 font-weight-bold mt-2">
                              Basic information
                            </Typography>
                          </Grid>
                          <Grid item mb={2}>
                            <span
                              className={getBadgeColor(
                                !!initialValues.activated,
                              )}
                            >
                              {getBadgeStatus(initialValues)}
                            </span>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          display="flex"
                          justifyContent="center"
                        >
                          <Grid item sm={4} display="flex" alignItems="center">
                            <Grid container direction="column" className="mt-2">
                              <Grid item>
                                <AvatarBadge
                                  badgeContent={getBadgeStatus(initialValues)}
                                  invisible={
                                    getBadgeStatus(initialValues) === 'Active'
                                  }
                                >
                                  <Avatar
                                    alt="avatarPhoto"
                                    src={
                                      avatar && !isAvatarCropOpen ? avatar : ''
                                    }
                                    sx={{ width: 100, height: 100, mb: 2 }}
                                  />
                                </AvatarBadge>
                              </Grid>
                              <Grid item>
                                <FormikInput
                                  accept="image/*"
                                  avatar={avatar}
                                  component={FileUploader}
                                  disabled={!isEdit}
                                  fileSizeUnit={FILE_SIZES.KB}
                                  initialValue={initialValues.avatarPhoto}
                                  label={avatarButtonLabel}
                                  maxFileSize={MAX_AVATAR_FILE_SIZE}
                                  name="avatarPhoto"
                                  onChange={(value) =>
                                    handleAvatarChange(value, setFieldValue)
                                  }
                                  open={isAvatarCropOpen}
                                />
                              </Grid>
                              {isEdit && (
                                <Typography className="mt-1">
                                  {`Note: avatar file size must be less than 
                    ${MAX_AVATAR_SIZE_READABLE}.`}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={8} className="mt-3">
                            <Grid container direction="column">
                              <Grid item>
                                <FormikInput
                                  name="lastName"
                                  label="Last name*"
                                  {...defaultInputProps}
                                />
                              </Grid>
                              <Grid item>
                                <FormikInput
                                  name="firstName"
                                  label="First name*"
                                  {...defaultInputProps}
                                />
                              </Grid>
                              <Grid item>
                                <FormikInput
                                  component={FormikMultiSelect}
                                  disabled={
                                    !isEdit ||
                                    loggedUser.id === initialValues.id ||
                                    !loggedUser.roles.find(
                                      ({ role }) => role === ADMIN,
                                    )
                                  }
                                  userId={loggedUser.id}
                                  userRoles={loggedUser.roles.map(
                                    ({ role }) => role,
                                  )}
                                  enableFeedback
                                  name="roles"
                                  fullWidth
                                  textInputProps={{
                                    label: 'Roles',
                                    variant: 'outlined',
                                    fullWidth: true,
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item mb={2} mt={2}>
                    <Typography className="text-black px-2 font-weight-bold">
                      Other information
                    </Typography>
                  </Grid>
                  <Grid item>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <FormikInput
                        component={DatePickerField}
                        disabled={!isEdit}
                        disableFuture
                        format={
                          isEdit
                            ? DATE_FORMATS.DATE_PICKER_EDIT
                            : DATE_FORMATS.DATE_PICKER_DISPLAY
                        }
                        fullWidth
                        inputVariant="outlined"
                        keyBoardFormat={DATE_FORMATS.DATE_PICKER_KEYBOARD}
                        label="Date of birth"
                        mask={isEdit ? DATE_FORMATS.DATE_PICKER_MASK : ''}
                        name="dateOfBirth"
                        placeholder={DATE_FORMATS.DATE_PICKER_PLACEHOLDER}
                        variant="inline"
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item>
                    <FormikInput
                      component={TextField}
                      disabled
                      enableFeedback
                      fullWidth
                      label="Email*"
                      name="email"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <FormikInput
                      component={FormikSimpleAutocomplete}
                      disabled={!isEdit}
                      enableFeedback
                      name="country"
                      options={countryNames}
                      textInputProps={{
                        label: 'Country',
                        variant: 'outlined',
                        fullWidth: true,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <FormikInput
                      label="City"
                      name="city"
                      {...defaultInputProps}
                    />
                  </Grid>
                  <Grid item mt={1}>
                    {isEditButtonVisible() && getEditButton()}
                    {isEdit && (
                      <>
                        <Button
                          color="primary"
                          sx={{ mr: 1 }}
                          type="submit"
                          variant="contained"
                          onClick={() => navigate(-1)}
                        >
                          Save
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => cancelEditing(handleReset)}
                          variant="contained"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        )}
      </Formik>
      <AlertDialog
        content={
          <AvatarCropper
            crop={crop}
            image={avatar}
            setCrop={setCrop}
            setImageRef={setImageRef}
          />
        }
        onClose={cancelAvatarChange}
        onSubmit={() => createCroppedImage(crop)}
        open={isAvatarCropOpen}
        text={'Please select the area for the avatar'}
        title={'Profile photo'}
      />
    </>
  );
};

UserProfileForm.propTypes = {
  cancelEditing: PropTypes.func.isRequired,
  initialValues: user.propTypes.isRequired,
  isEdit: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  renderEditButton: PropTypes.func,
};

UserProfileForm.defaultProps = {
  isEdit: true,
};

export default UserProfileForm;
