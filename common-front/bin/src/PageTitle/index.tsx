import { ReactNode } from 'react';
import { Paper, Typography } from '@mui/material';

export interface PageTitleProps {
  titleHeading?: string;
  titleDescription?: string;
  titleContent?: ReactNode;
  descriptionContent?: ReactNode;
  titleStatus?: string;
}

export function PageTitle(props: PageTitleProps) {
  const {
    titleHeading,
    titleDescription,
    titleContent,
    descriptionContent,
    titleStatus,
  } = props;
  return (
    <Paper square elevation={2} className="app-page-title">
      <div>
        <div className="app-page-title--first">
          <div className="app-page-title--heading">
            <h1>{titleHeading || titleContent}</h1>
            {titleStatus && (
              <Typography variant="body2" style={{ color: '#ff5252' }}>
                {titleStatus}
              </Typography>
            )}
            <div className="app-page-title--description" style={{ margin: 0 }}>
              {titleDescription || descriptionContent}
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
}
