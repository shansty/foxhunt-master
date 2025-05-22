import React from 'react';
import { PageTitle } from 'common-front';

const CreateLocationPageTitle = () => {
  const description = 'Create a location';
  const title = 'Locations';

  return <PageTitle titleHeading={title} titleDescription={description} />;
};

export default CreateLocationPageTitle;
