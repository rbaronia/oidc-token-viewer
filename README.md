# OIDC Token Viewer

A modern single-page application built with React and Carbon Design System that demonstrates OIDC authentication and token visualization.

## Features

- OIDC authentication with automatic login flow
- Token data displayed in both table and raw format
- Carbon Design System UI components
- Detailed logging with a custom browser-compatible logger implementation
- Environment-based configuration
- Responsive design

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your OIDC settings in `.env`:
   - REACT_APP_OIDC_AUTHORITY: Your OIDC provider's URL
   - REACT_APP_OIDC_CLIENT_ID: Your client ID
   - REACT_APP_OIDC_REDIRECT_URI: Your callback URL
   - REACT_APP_OIDC_POST_LOGOUT_REDIRECT_URI: Your post-logout redirect URL
   - REACT_APP_OIDC_SCOPE: Required scopes
   - REACT_APP_LOG_LEVEL: Logging level (debug/info/warn/error)

3. Start the development server:
   ```bash
   npm start
   ```

## Important Note

Ensure the `src/index.js` file is present as it is required for the application to start. This file serves as the entry point for the React application and is responsible for rendering the main `App` component into the DOM.

## Browser Compatibility

The application is designed to run in modern browsers and uses a browser-compatible logging implementation instead of Node.js-specific libraries. This ensures that you won't encounter polyfill-related errors during development or production builds.

## Development Notes

- The application uses a custom browser-compatible logger implementation instead of Winston to avoid Node.js core module dependencies.
- Essential files that must be present:
  - `src/index.js`: Entry point for the React application
  - `src/index.css`: Basic styles for the application
  - `public/index.html`: HTML template for the SPA

## Troubleshooting

If you encounter build issues related to Node.js core modules, the application has been configured to avoid these dependencies. If you need server-side logging, consider implementing a separate logging service rather than trying to use Node.js libraries in the browser environment.

## Architecture

- React for UI components
- Carbon Design System for styling and UI components
- oidc-client-ts for OIDC authentication
- React Router for navigation

## Development

The application uses environment variables for configuration. Make sure to update the `.env` file with your OIDC provider's details before running the application.

## How to Acquire and View Tokens

The OIDC Token Viewer application automatically handles token acquisition through the OpenID Connect authentication flow:

1. **Initial Access**: When you first access the application, it checks for an existing authenticated session.
   
2. **Authentication Flow**:
   - If no valid session exists, you'll be automatically redirected to your configured OIDC provider's login page.
   - After successful authentication, the provider redirects back to your application's callback URL.
   - The application processes the authentication response and stores the tokens securely in memory.

3. **Token Display**: Once authenticated, the application displays:
   - A formatted table of all claims from your ID token
   - The raw token data in JSON format for inspection or copying

4. **Token Management**:
   - Tokens are stored in browser memory only and not persisted to disk for security
   - You can log out at any time using the logout button in the header
   - Token refresh is handled automatically if refresh tokens are enabled in your OIDC configuration

5. **Configure Your OIDC Provider**:
   To use your own OIDC provider, update the following settings in your `.env` file:
   ```
   REACT_APP_OIDC_AUTHORITY=https://your-oidc-provider.com
   REACT_APP_OIDC_CLIENT_ID=your-client-id
   REACT_APP_OIDC_REDIRECT_URI=http://localhost:3000/callback
   REACT_APP_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
   REACT_APP_OIDC_SCOPE="openid profile email"
   ```

6. **Register Your Application**:
   - Register your application with your OIDC provider
   - Ensure your redirect URIs match exactly with the configured values
   - Request the necessary scopes for the claims you wish to display

For debugging purposes, you can set `REACT_APP_LOG_LEVEL=debug` in your `.env` file to see detailed logging information about the token acquisition process.
