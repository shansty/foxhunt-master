import React from 'react';
import { Card, CardContent, Grid } from '@mui/material';

import { useIsMobile } from 'common-front';
import { StyledContainer } from './styles';

const OuterAppLayout = ({ title, description, image, children }) => {
  const isMobile = useIsMobile();

  return (
    <StyledContainer
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item id="illustration">
        {image && <img alt="illustration" src={image} />}
      </Grid>
      <Grid item>
        <h1
          className={`text-center mb-3 font-weight-bold ${
            isMobile ? 'display-4 mx-1' : 'display-3'
          }`}
        >
          {title}
        </h1>
        <Card>
          <CardContent>
            <div className="card-body px-lg-5">
              <div className="text-center text-muted mb-4">
                <span>{description}</span>
              </div>
              {children}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </StyledContainer>
  );
};

export default OuterAppLayout;
