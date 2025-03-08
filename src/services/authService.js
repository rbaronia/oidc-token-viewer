import { UserManager } from 'oidc-client-ts';
import logger from '../utils/logger';

// Read configuration from environment
const getConfig = () => {
  const config = {
    authority: process.env.REACT_APP_OIDC_AUTHORITY,
    client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_OIDC_REDIRECT_URI,
    post_logout_redirect_uri: process.env.REACT_APP_OIDC_POST_LOGOUT_REDIRECT_URI,
    scope: process.env.REACT_APP_OIDC_SCOPE,
    response_type: 'code',
    // Additional settings that help with debugging
    loadUserInfo: true,
    automaticSilentRenew: true,
    monitorSession: true,
    filterProtocolClaims: true,
  };

  // Basic validation
  const requiredFields = ['authority', 'client_id', 'redirect_uri', 'scope'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    const error = `Missing required OIDC configuration: ${missingFields.join(', ')}`;
    logger.error(error);
    throw new Error(error);
  }
  
  return config;
};

class AuthService {
  userManager;

  constructor() {
    try {
      const config = getConfig();
      logger.info('Initializing AuthService with config:', config);
      this.userManager = new UserManager(config);
      
      // Add event listeners for debugging
      this.userManager.events.addUserLoaded(() => {
        logger.info('User loaded successfully');
      });
      
      this.userManager.events.addSilentRenewError((error) => {
        logger.error('Silent renew error:', error);
      });
      
      this.userManager.events.addUserSignedOut(() => {
        logger.info('User signed out');
      });
      
      logger.info('AuthService initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize AuthService:', error);
      throw error;
    }
  }

  async login() {
    try {
      logger.info('Initiating login...');
      logger.info('Using redirect URI:', process.env.REACT_APP_OIDC_REDIRECT_URI);
      await this.userManager.signinRedirect();
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async handleLoginCallback() {
    try {
      logger.info('Processing login callback...');
      const user = await this.userManager.signinRedirectCallback();
      logger.info('Login successful');
      return user;
    } catch (error) {
      logger.error('Login callback failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      logger.info('Initiating logout...');
      await this.userManager.signoutRedirect();
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }

  async getUser() {
    try {
      return await this.userManager.getUser();
    } catch (error) {
      logger.error('Get user failed:', error);
      throw error;
    }
  }
}

// Create and export an instance of the AuthService
const authServiceInstance = new AuthService();
export default authServiceInstance;
