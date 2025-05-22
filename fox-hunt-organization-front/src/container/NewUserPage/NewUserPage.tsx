import React from 'react';
import PageTitle from '../MainLayout/PageTitle/PageTitle';
import UserForm from '../../form/UserForm';

export default function NewUserPage() {
  return (
    <>
      <PageTitle
        titleHeading="Users"
        titleDescription="Users are the people consisting an organization."
      />
      <UserForm />
    </>
  );
}
