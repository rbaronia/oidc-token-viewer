import React from 'react';
import { Button, Heading, Stack, Grid, Column, InlineLoading } from '@carbon/react';
import authService from '../services/authService';
import logger from '../utils/logger';

function HomePage() {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      logger.info('Login button clicked, initiating OIDC flow');
      
      // Log environment variables to verify they're loaded
      logger.info('Environment variables:', {
        authority: process.env.REACT_APP_OIDC_AUTHORITY,
        clientId: process.env.REACT_APP_OIDC_CLIENT_ID,
        redirectUri: process.env.REACT_APP_OIDC_REDIRECT_URI
      });
      
      // Directly trigger the login flow
      await authService.login();
    } catch (error) {
      logger.error('Error initiating login:', error);
      setLoading(false);
    }
  };

  return (
    <Grid className="landing-page" fullWidth>
      <Column lg={16} md={8} sm={4} className="landing-page__banner">
        <Heading className="landing-page__heading">OIDC Token Viewer</Heading>
      </Column>
      <Column lg={16} md={8} sm={4} className="landing-page__r2">
        <Stack gap={7}>
          <Heading>Welcome to the OIDC Token Viewer</Heading>
          <p className="landing-page__p">
            This application allows you to authenticate with an OpenID Connect provider
            and view your token details. Click the login button below to get started.
          </p>
          {loading ? (
            <InlineLoading description="Initiating login..." />
          ) : (
            <Button onClick={handleLogin} size="lg">
              Log in
            </Button>
          )}
        </Stack>
      </Column>
    </Grid>
  );
}

export default HomePage;
