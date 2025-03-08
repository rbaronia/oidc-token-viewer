import React, { useEffect } from 'react';
import { Loading } from '@carbon/react';
import authService from '../services/authService';
import logger from '../utils/logger';

function Login() {
  useEffect(() => {
    const initiateLogin = async () => {
      try {
        // Log configuration to verify it's being correctly loaded
        logger.info('OIDC Configuration:', {
          authority: process.env.REACT_APP_OIDC_AUTHORITY,
          clientId: process.env.REACT_APP_OIDC_CLIENT_ID,
          redirectUri: process.env.REACT_APP_OIDC_REDIRECT_URI,
          scope: process.env.REACT_APP_OIDC_SCOPE
        });
        
        logger.info('Initiating OIDC login flow...');
        // Add a small delay to ensure logging appears in console before redirect
        setTimeout(async () => {
          await authService.login();
        }, 100);
      } catch (error) {
        logger.error('Error initiating login:', error);
        // In a production app, you might want to redirect to an error page
      }
    };

    initiateLogin();
  }, []);

  return <Loading description="Redirecting to login..." />;
}

export default Login;
