import React, { useState, useEffect } from 'react';
import { Button, Stack, CodeSnippet, Loading } from '@carbon/react';
import { UserManager, Log } from 'oidc-client-ts';
import logger from '../utils/logger';

// Direct implementation of login without using the service
function DebugLogin() {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add to log with timestamp
  const addLog = (message) => {
    const timestamp = new Date().toISOString();
    setLog(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(`${timestamp}: ${message}`);
  };

  useEffect(() => {
    // Enable oidc-client-ts detailed logging
    Log.setLogger(console);
    Log.setLevel(Log.DEBUG);
    
    addLog('DebugLogin component mounted');
    addLog(`Auth Authority: ${process.env.REACT_APP_OIDC_AUTHORITY}`);
    addLog(`Client ID: ${process.env.REACT_APP_OIDC_CLIENT_ID}`);
    addLog(`Redirect URI: ${process.env.REACT_APP_OIDC_REDIRECT_URI}`);
  }, []);
  
  const handleDirectLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      addLog('Creating UserManager directly...');
      
      const config = {
        authority: process.env.REACT_APP_OIDC_AUTHORITY,
        client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
        redirect_uri: process.env.REACT_APP_OIDC_REDIRECT_URI,
        response_type: 'code',
        scope: process.env.REACT_APP_OIDC_SCOPE || 'openid profile email',
        loadUserInfo: true,
      };
      
      addLog(`Using config: ${JSON.stringify(config, null, 2)}`);
      
      const userManager = new UserManager(config);
      
      addLog('Calling signinRedirect()...');
      await userManager.signinRedirect();
      
      addLog('signinRedirect called successfully');
    } catch (err) {
      const errorMessage = `Login error: ${err.message}`;
      addLog(errorMessage);
      addLog(`Full error: ${JSON.stringify(err, Object.getOwnPropertyNames(err), 2)}`);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleHardcodedLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      addLog('Creating UserManager with hardcoded values...');
      
      // Hardcoded config for testing
      const config = {
        authority: 'https://www.iamlab.ibm.com/mga/sps/oauth/oauth20',
        client_id: 'MMPdQGPKDwowawJ1MkSa',
        redirect_uri: 'http://localhost:3000/callback',
        response_type: 'code',
        scope: 'openid profile email',
        loadUserInfo: true,
      };
      
      addLog(`Using hardcoded config: ${JSON.stringify(config, null, 2)}`);
      
      const userManager = new UserManager(config);
      
      addLog('Calling signinRedirect with hardcoded values...');
      await userManager.signinRedirect();
      
      addLog('Hardcoded signinRedirect called successfully');
    } catch (err) {
      const errorMessage = `Hardcoded login error: ${err.message}`;
      addLog(errorMessage);
      addLog(`Full error: ${JSON.stringify(err, Object.getOwnPropertyNames(err), 2)}`);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const testProviderConnectivity = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authority = process.env.REACT_APP_OIDC_AUTHORITY || 'https://www.iamlab.ibm.com/mga/sps/oauth/oauth20';
      
      addLog(`Testing connectivity to OIDC provider: ${authority}`);
      
      // Attempt to fetch the OpenID configuration endpoint
      const openIdConfigUrl = `${authority}/.well-known/openid-configuration`;
      addLog(`Fetching OpenID configuration from: ${openIdConfigUrl}`);
      
      const response = await fetch(openIdConfigUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        addLog('Successfully connected to OIDC provider');
        addLog(`Provider configuration: ${JSON.stringify(data, null, 2)}`);
      } else {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      const errorMessage = `Connectivity test failed: ${err.message}`;
      addLog(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>OIDC Debug Login</h1>
      
      <Stack gap={5}>
        <div>
          <h3>Environment Variables:</h3>
          <ul>
            <li>REACT_APP_OIDC_AUTHORITY: {process.env.REACT_APP_OIDC_AUTHORITY || 'Not set'}</li>
            <li>REACT_APP_OIDC_CLIENT_ID: {process.env.REACT_APP_OIDC_CLIENT_ID || 'Not set'}</li>
            <li>REACT_APP_OIDC_REDIRECT_URI: {process.env.REACT_APP_OIDC_REDIRECT_URI || 'Not set'}</li>
            <li>REACT_APP_OIDC_SCOPE: {process.env.REACT_APP_OIDC_SCOPE || 'Not set'}</li>
          </ul>
        </div>
        
        <div>
          <h3>Test Login</h3>
          <Stack orientation="horizontal" gap={2}>
            <Button onClick={handleDirectLogin} disabled={loading}>
              Login with Env Variables
            </Button>
            
            <Button onClick={handleHardcodedLogin} disabled={loading} kind="secondary">
              Login with Hardcoded Values
            </Button>
            
            <Button onClick={testProviderConnectivity} disabled={loading} kind="tertiary">
              Test Provider Connectivity
            </Button>
          </Stack>
          
          {loading && <Loading description="Attempting login..." />}
          {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
        </div>
        
        <div>
          <h3>Common Causes for "Failed to fetch" Error:</h3>
          <ol>
            <li>The OIDC provider endpoint may not be accessible from your network</li>
            <li>CORS policies on the OIDC provider may be blocking requests from localhost</li>
            <li>The OIDC provider URL may be incorrect or misconfigured</li>
            <li>Network connectivity issues or firewall restrictions</li>
            <li>The OIDC provider may require additional headers or authentication for discovery</li>
          </ol>
        </div>
        
        <div>
          <h3>Debug Log:</h3>
          <CodeSnippet type="multi" feedback="Copied to clipboard">
            {log.join('\n')}
          </CodeSnippet>
        </div>
      </Stack>
    </div>
  );
}

export default DebugLogin;
