import illustration from '../../theme/assets/images/illustrations/404.svg';
import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="MuiGrid-root px-4 px-lg-0 mx-auto text-center text-black MuiGrid-item MuiGrid-grid-md-9 MuiGrid-grid-lg-6">
      <img
        alt="404"
        className="w-50 mx-auto d-block my-5 img-fluid"
        src={illustration}
      />
      <h3 className="font-size-xxl line-height-sm font-weight-light d-block px-3 mb-3 text-black-50 w-50 mx-auto d-block my-5">
        The page you were looking for doesn&apos;t exist.
      </h3>
      <p className="mb-4">
        You may have mistyped the address or the page may have moved.
      </p>
    </div>
  );
}
