import { UserManager } from 'oidc-client-ts';
import logger from '../utils/logger';

// Read configuration from environment
const getConfig = () => {
  // During build time or when OIDC is disabled, return null
  if (process.env.BUILD_TIME || process.env.REACT_APP_DISABLE_OIDC === 'true') {
    logger.debug('OIDC disabled during build or by configuration');
    return null;
  }

  const config = {
    authority: process.env.REACT_APP_OIDC_AUTHORITY,
    client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_OIDC_REDIRECT_URI,
    post_logout_redirect_uri: process.env.REACT_APP_OIDC_POST_LOGOUT_REDIRECT_URI,
    scope: process.env.REACT_APP_OIDC_SCOPE,
    response_type: 'code',
    // Glitch-specific settings
    loadUserInfo: true,
    automaticSilentRenew: false, // Disable automatic renewal
    monitorSession: false, // Disable session monitoring
    filterProtocolClaims: true,
    silentRequestTimeout: 1000, // Reduce timeout to 1 second since we're not using silent renewal
    clockSkewInSeconds: 300, // 5 minutes clock skew allowance
    staleStateAgeInSeconds: 3600, // 1 hour
    userStore: null, // Don't use web storage for tokens in Glitch
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
  initialized = false;

  constructor() {
    try {
      const config = getConfig();
      
      // If OIDC is disabled or we're in build time, don't initialize
      if (!config) {
        logger.debug('AuthService initialization skipped - OIDC disabled');
        return;
      }

      logger.info('Initializing AuthService with config:', {
        ...config,
        client_id: '***REDACTED***',
        authority: '***REDACTED***'
      });

      this.userManager = new UserManager(config);
      
      // Add event listeners for debugging
      this.userManager.events.addUserLoaded((user) => {
        logger.info('User loaded successfully');
      });
      
      this.userManager.events.addSilentRenewError((error) => {
        // Just log silently and don't propagate the error since we're not using silent renewal
        logger.debug('Silent renew error (expected):', error);
      });
      
      this.userManager.events.addUserSignedOut(() => {
        logger.info('User signed out');
        // Clear any cached user data
        this.userManager.clearStaleState();
      });
      
      this.initialized = true;
      logger.info('AuthService initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize AuthService:', error);
      throw error;
    }
  }

  async login() {
    if (!this.initialized) {
      logger.warn('Login attempted but AuthService is not initialized');
      return;
    }

    try {
      logger.info('Initiating login...');
      await this.userManager.signinRedirect();
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async handleLoginCallback() {
    if (!this.initialized) {
      logger.warn('Login callback attempted but AuthService is not initialized');
      return null;
    }

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
    if (!this.initialized) {
      logger.warn('Logout attempted but AuthService is not initialized');
      return;
    }

    try {
      logger.info('Initiating logout...');
      await this.userManager.signoutRedirect();
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }

  async getUser() {
    if (!this.initialized) {
      logger.debug('Get user attempted but AuthService is not initialized');
      return null;
    }

    try {
      const user = await this.userManager.getUser();
      if (!user) {
        logger.debug('No user found in session');
        return null;
      }
      return user;
    } catch (error) {
      logger.error('Get user failed:', error);
      return null; // Return null instead of throwing to handle errors gracefully
    }
  }
}

// Create and export an instance of the AuthService
const authServiceInstance = new AuthService();
export default authServiceInstance;
