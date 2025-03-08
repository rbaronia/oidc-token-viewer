import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@carbon/react';
import authService from '../services/authService';
import logger from '../utils/logger';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        logger.info('Processing OIDC callback...');
        await authService.handleLoginCallback();
        logger.info('Callback processed successfully, redirecting to token page...');
        navigate('/token');
      } catch (error) {
        logger.error('Error processing callback:', error);
        // In a production app, you might want to redirect to an error page
        navigate('/');
      }
    };

    processCallback();
  }, [navigate]);

  return <Loading description="Processing login..." />;
};

export default Callback;
