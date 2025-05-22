import React from 'react';
import PageTitle from '../MainLayout/PageTitle/PageTitle';
import OrganizationForm from '../../form/OrganizationForm';

export default function NewOrganizationPage() {
  return (
    <>
      <PageTitle
        titleHeading="Organizations"
        titleDescription="Organizations represent workspaces on own domain."
      />
      <OrganizationForm />
    </>
  );
}
