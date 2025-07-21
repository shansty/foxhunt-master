import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography } from '@mui/material';
import { PageTitle } from 'common-front';
import { selectLoggedUser } from 'src/store/selectors/authSelectors';
import { updateUser, getUserById } from 'src/store/actions/usersActions';
import { getGravatarImage } from 'src/store/actions/usersActions';
import UserProfileForm from 'src/components/UserProfileForm';
import { formatDateNoTimeZone } from 'src/utils/formatUtil';
import { signInRequired } from 'src/hocs/permissions';
import { buildUserUrl } from 'src/api/utils/navigationUtil';
import { userErrorSelector } from 'src/store/selectors/errorsSelectors';
import { buildNotFoundUrl } from 'src/api/utils/navigationUtil';
import MainLayout from 'src/layouts/MainLayout';
import {
  getTopPriorityUserRole,
  isRoleHasUpperPriority,
} from 'src/utils/userUtils';

const defaultTitle = 'My Profile';
const userProfileTitle = 'User Profile';
const description = 'Here you can see and edit user profile information';

const getTitle = (name, surname) => `${name} ${surname} Profile`;

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const currentUser = useSelector(selectLoggedUser);
  const [userToEdit, setUserToEdit] = useState(currentUser);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [loadError, setLoadError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const userError = useSelector(userErrorSelector);
  const navigate = useNavigate();

  useEffect(() => {
    setAvatar(currentUser?.avatar);
    setUserToEdit(currentUser);
  }, []);

  const goToUsersList = useCallback(() => {
    navigate(buildUserUrl());
  }, [navigate]);

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id))
        .then(({ payload }) => {
          const { data } = payload;
          if (data && data.email) {
            const fullfiledUser = {
              ...data,
              city: data.city || '',
              country: data.country || '',
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              dateOfBirth: data.dateOfBirth || null,
            };
            fullfiledUser.avatar
              ? setAvatar(fullfiledUser.avatar)
              : getDefaultAvatar(fullfiledUser.email);
            setUserToEdit(fullfiledUser);
            setTitle(getTitle(fullfiledUser.firstName, fullfiledUser.lastName));
          } else {
            navigate(buildNotFoundUrl());
          }
        })
        .catch((err) => {
          navigate(buildNotFoundUrl());
        });
      if (userError) navigate(buildNotFoundUrl());
    }
  }, [dispatch, id, goToUsersList, userError]);

  const getDefaultAvatar = async (email) => {
    const gravatar = await dispatch(getGravatarImage(email));
    if (!(gravatar instanceof Error)) {
      setAvatar(gravatar.payload);
      return gravatar;
    }
  };

  const onSave = async (formValues, { setSubmitting }) => {
    setSubmitting(false);

    const updatedUser = {
      id: userToEdit.id,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      dateOfBirth: null,
      country: formValues.country,
      city: formValues.city,
      avatar: avatar,
      roles: formValues.roles,
    };

    if (formValues.dateOfBirth) {
      updatedUser.dateOfBirth = formatDateNoTimeZone(formValues.dateOfBirth);
    }

    const response = await dispatch(updateUser({ updatedUser, id }));

    if (!(response instanceof Error)) {
      if (id) {
        smoothRedirect(response);
      } else {
        setIsEdit(false);
        if (!response.data.avatar) {
          await getDefaultAvatar(response.data.email);
        }
      }
    }
  };

  const isEditButtonVisible = () => {
    const isUserSeeHisProfile = id === undefined || id == currentUser.id;
    const userToEditTopPriorityRole = getTopPriorityUserRole(userToEdit);
    const currentUserTopPriorityRole = getTopPriorityUserRole(currentUser);
    let isUserHasRightsToEdit = false;
    if (
      isRoleHasUpperPriority(
        currentUserTopPriorityRole,
        userToEditTopPriorityRole,
      )
    )
      isUserHasRightsToEdit = true;

    return (isUserSeeHisProfile || isUserHasRightsToEdit) && !isEdit;
  };

  const cancelEditing = (handleReset) => {
    if (id) {
      goToUsersList();
    } else {
      setAvatar(currentUser.avatar);
      handleReset();
      setIsEdit(false);
    }
  };

  const getEditButton = () => (
    <Button variant="contained" color="primary" onClick={() => setIsEdit(true)}>
      Edit
    </Button>
  );

  const smoothRedirect = (data) =>
    setTimeout(() => {
      if (data.status < 400) {
        goToUsersList();
      }
    }, 500);

  return (
    <MainLayout>
      <PageTitle titleHeading={title} titleDescription={description} />
      {loadError ? (
        <Typography>{loadError}</Typography>
      ) : (
        <>
          {userToEdit && (
            <UserProfileForm
              initialValues={{ ...userToEdit }}
              onSave={onSave}
              isEdit={isEdit}
              cancelEditing={cancelEditing}
              getEditButton={getEditButton}
              isEditButtonVisible={isEditButtonVisible}
              avatar={avatar}
              setAvatar={setAvatar}
            />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default signInRequired(UserProfilePage);
