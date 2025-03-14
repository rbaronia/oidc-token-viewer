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

## Architecture

- React for UI components
- Carbon Design System for styling and UI components
- oidc-client-ts for OIDC authentication
- React Router for navigation


## Configuration

Example configuration:

```
REACT_APP_OIDC_AUTHORITY=https://your-oidc-provider.com
REACT_APP_OIDC_CLIENT_ID=your-client-id
REACT_APP_OIDC_REDIRECT_URI=http://localhost:3000/callback
REACT_APP_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
REACT_APP_OIDC_SCOPE="openid profile email"
REACT_APP_LOG_LEVEL=info
```


## Deployment

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/rbaronia/oidc-token-viewer.git
   cd oidc-token-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration settings
  
4. Start the development server:
   ```bash
   npm start
   ```

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The built application will be in the `build/` directory, which can be deployed to any static file hosting service, such as:
   - GitHub Pages
   - Netlify
   - AWS S3 + CloudFront
   - Azure Static Web Apps
   - Glitch

### Deploying on Glitch

Glitch provides a simple way to host and deploy web applications. Follow these steps to deploy the OIDC Token Viewer on Glitch:

1. **Create a Glitch account**:
   - Go to [Glitch.com](https://glitch.com/) and sign up or log in
   
2. **Create a new project on Glitch**:
   - Click "New Project" and choose "Import from GitHub"
   - Enter your GitHub repository URL: `https://github.com/rbaronia/oidc-token-viewer.git`
   
3. **Configure environment variables**:
   - In your Glitch project, click on "Tools" in the bottom-left corner
   - Select ".env" from the dropdown menu
   - Add your configuration values as they appear in your local `.env` file:
     ```
     REACT_APP_OIDC_AUTHORITY=https://your-oidc-provider.com
     REACT_APP_OIDC_CLIENT_ID=your-client-id
     REACT_APP_OIDC_REDIRECT_URI=https://your-glitch-app-name.glitch.me/callback
     REACT_APP_OIDC_POST_LOGOUT_REDIRECT_URI=https://your-glitch-app-name.glitch.me
     REACT_APP_OIDC_SCOPE="openid profile email"
     REACT_APP_LOG_LEVEL=info
     ```
   - **Important**: Make sure to update the redirect URIs to match your Glitch app URL

4. **Modify package.json** (if needed):
   - Glitch uses the "start" script to run your application
   - Ensure your `package.json` includes a proper start script:
     ```json
     "scripts": {
       "start": "node server.js",
       "build": "webpack --mode production",
       ...
     }
     ```
   - If you don't have a server.js file, create one with a simple Express server to serve the build directory:
     ```javascript
     // server.js
     const express = require('express');
     const path = require('path');
     const app = express();
     
     // Serve static files from the 'build' directory
     app.use(express.static(path.join(__dirname, 'build')));
     
     // For any request that doesn't match a static file, serve index.html
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, 'build', 'index.html'));
     });
     
     const PORT = process.env.PORT || 3000;
     app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
     });
     ```

5. **Install dependencies and build**:
   - In the Glitch console (Tools > Terminal), run:
     ```bash
     npm install
     npm run build
     ```

6. **Update OIDC Provider settings**:
   - Log in to your OIDC provider's dashboard
   - Add your Glitch app URL as an authorized redirect URI:
     - `https://your-glitch-app-name.glitch.me/callback`
   - Add your Glitch app URL as an allowed origin:
     - `https://your-glitch-app-name.glitch.me`

7. **Access your deployed application**:
   - Your app is now live at `https://your-glitch-app-name.glitch.me`
   - Click "Show" in the Glitch UI to open your application

8. **Troubleshooting**:
   - If your application doesn't load properly, check the Glitch logs (Tools > Logs)
   - Verify that all environment variables are set correctly
   - Ensure that your OIDC provider allows your Glitch domain as a valid redirect URI

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
