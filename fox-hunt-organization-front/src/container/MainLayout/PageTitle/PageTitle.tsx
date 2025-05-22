import React from 'react';

import { Paper } from '@mui/material';

interface PageTitleProps {
  titleHeading: string;
  titleDescription: string;
}

function PageTitle(props: PageTitleProps) {
  return (
    <Paper square elevation={2} className="app-page-title">
      <div>
        <div className="app-page-title--first">
          <div className="app-page-title--heading">
            <h1>{props.titleHeading}</h1>
            <div className="app-page-title--description">
              {props.titleDescription}
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default PageTitle;
