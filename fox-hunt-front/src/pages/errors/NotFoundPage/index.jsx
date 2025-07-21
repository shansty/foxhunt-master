import React from 'react';

import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';
import { DIV_CLASS_NAME, HEADING_CLASS_NAME } from '../styles';
import illustration from 'src/theme/assets/images/illustrations/404.svg';

function NotFoundPage() {
  return (
    <MainLayout>
      <div className={DIV_CLASS_NAME}>
        <img
          alt="404"
          className="w-50 mx-auto d-block my-5 img-fluid"
          src={illustration}
        />
        <h3 className={HEADING_CLASS_NAME}>
          The page you are looking for doesn&apos;t exist.
        </h3>
        <p className="mb-4">
          You may have mistyped the address or the page may have moved.
        </p>
      </div>
    </MainLayout>
  );
}

export default signInRequired(NotFoundPage);
