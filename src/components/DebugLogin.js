import React, { useState, useEffect } from 'react';
import { Button, Stack, CodeSnippet, Loading, TextInput, Form, FormGroup, Checkbox, Dropdown } from '@carbon/react';
import { UserManager, Log } from 'oidc-client-ts';

// Direct implementation of login without using the service
function DebugLogin() {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Runtime editable configuration
  const [config, setConfig] = useState({
    authority: process.env.REACT_APP_OIDC_AUTHORITY || '',
    client_id: process.env.REACT_APP_OIDC_CLIENT_ID || '',
    redirect_uri: process.env.REACT_APP_OIDC_REDIRECT_URI || window.location.origin + '/callback',
    response_type: 'code',
    scope: process.env.REACT_APP_OIDC_SCOPE || 'openid profile email',
    client_secret: '',
    post_logout_redirect_uri: process.env.REACT_APP_OIDC_POST_LOGOUT_REDIRECT_URI || window.location.origin,
    loadUserInfo: true,
    automaticSilentRenew: true,
  });
  
  // Response type options
  const responseTypeOptions = [
    { id: 'code', text: 'Authorization Code (code)' },
    { id: 'id_token', text: 'Implicit - ID Token (id_token)' },
    { id: 'id_token token', text: 'Implicit - ID Token + Access Token (id_token token)' },
    { id: 'code id_token', text: 'Hybrid - Auth Code + ID Token (code id_token)' },
    { id: 'code token', text: 'Hybrid - Auth Code + Access Token (code token)' },
    { id: 'code id_token token', text: 'Hybrid - Auth Code + ID Token + Access Token (code id_token token)' }
  ];

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
    addLog(`Default Auth Authority: ${process.env.REACT_APP_OIDC_AUTHORITY}`);
    addLog(`Default Client ID: ${process.env.REACT_APP_OIDC_CLIENT_ID}`);
    addLog(`Default Redirect URI: ${process.env.REACT_APP_OIDC_REDIRECT_URI}`);
    
    // Check if we have previously saved config in sessionStorage
    const savedConfig = sessionStorage.getItem('oidc_debug_config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        addLog('Loaded saved configuration from session storage');
      } catch (err) {
        addLog(`Error loading saved configuration: ${err.message}`);
      }
    }
  }, []);
  
  const handleConfigChange = (field, value) => {
    setConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      // Save to session storage for persistence
      sessionStorage.setItem('oidc_debug_config', JSON.stringify(newConfig));
      return newConfig;
    });
  };
  
  const handleCheckboxChange = (field) => {
    setConfig(prev => {
      const newConfig = { ...prev, [field]: !prev[field] };
      sessionStorage.setItem('oidc_debug_config', JSON.stringify(newConfig));
      return newConfig;
    });
  };
  
  const handleResponseTypeChange = (event) => {
    const selectedType = event.selectedItem.id;
    handleConfigChange('response_type', selectedType);
  };
  
  const resetToDefaults = () => {
    setConfig({
      authority: process.env.REACT_APP_OIDC_AUTHORITY || '',
      client_id: process.env.REACT_APP_OIDC_CLIENT_ID || '',
      redirect_uri: process.env.REACT_APP_OIDC_REDIRECT_URI || window.location.origin + '/callback',
      response_type: 'code',
      scope: process.env.REACT_APP_OIDC_SCOPE || 'openid profile email',
      client_secret: '',
      post_logout_redirect_uri: process.env.REACT_APP_OIDC_POST_LOGOUT_REDIRECT_URI || window.location.origin,
      loadUserInfo: true,
      automaticSilentRenew: true,
    });
    sessionStorage.removeItem('oidc_debug_config');
    addLog('Reset configuration to environment defaults');
  };
  
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      addLog('Creating UserManager with custom configuration...');
      
      // Create a clean config object for UserManager
      const userManagerConfig = {
        authority: config.authority,
        client_id: config.client_id,
        redirect_uri: config.redirect_uri,
        response_type: config.response_type,
        scope: config.scope,
        post_logout_redirect_uri: config.post_logout_redirect_uri,
        loadUserInfo: config.loadUserInfo,
        automaticSilentRenew: config.automaticSilentRenew,
      };
      
      // Only add client_secret if it's provided
      if (config.client_secret) {
        userManagerConfig.client_secret = config.client_secret;
      }
      
      addLog(`Using config: ${JSON.stringify(userManagerConfig, null, 2)}`);
      
      const userManager = new UserManager(userManagerConfig);
      
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

  const testProviderConnectivity = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authority = config.authority;
      
      if (!authority) {
        throw new Error('Authority URL is required');
      }
      
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
      <h1>OIDC Configuration Editor & Debug Login</h1>
      
      <Stack gap={5}>
        <Form>
          <h3>OIDC Configuration Parameters:</h3>
          <p className="helper-text">Edit these parameters to test with any OAuth server at runtime without modifying .env files</p>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <FormGroup legendText="Provider Settings">
              <TextInput 
                id="authority" 
                labelText="Authority URL" 
                value={config.authority} 
                onChange={(e) => handleConfigChange('authority', e.target.value)}
                placeholder="https://your-oauth-server.com"
                helperText="The base URL of your OAuth/OIDC provider"
              />
              
              <TextInput 
                id="client_id" 
                labelText="Client ID" 
                value={config.client_id} 
                onChange={(e) => handleConfigChange('client_id', e.target.value)}
                placeholder="your-client-id"
              />
              
              <TextInput 
                id="client_secret" 
                labelText="Client Secret (optional)" 
                value={config.client_secret} 
                onChange={(e) => handleConfigChange('client_secret', e.target.value)}
                placeholder="your-client-secret"
                type="password"
                helperText="Only needed for confidential clients"
              />
            </FormGroup>
            
            <FormGroup legendText="Redirect Settings">
              <TextInput 
                id="redirect_uri" 
                labelText="Redirect URI" 
                value={config.redirect_uri} 
                onChange={(e) => handleConfigChange('redirect_uri', e.target.value)}
                placeholder="http://localhost:3000/callback"
              />
              
              <TextInput 
                id="post_logout_redirect_uri" 
                labelText="Post Logout Redirect URI" 
                value={config.post_logout_redirect_uri} 
                onChange={(e) => handleConfigChange('post_logout_redirect_uri', e.target.value)}
                placeholder="http://localhost:3000"
              />
            </FormGroup>
          </div>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <FormGroup legendText="Protocol Settings">
              <Dropdown 
                id="response_type"
                titleText="Response Type"
                label="Select a response type"
                items={responseTypeOptions}
                selectedItem={responseTypeOptions.find(item => item.id === config.response_type)}
                onChange={handleResponseTypeChange}
                itemToString={(item) => (item ? item.text : '')}
              />
              
              <TextInput 
                id="scope" 
                labelText="Scope" 
                value={config.scope} 
                onChange={(e) => handleConfigChange('scope', e.target.value)}
                placeholder="openid profile email"
              />
            </FormGroup>
            
            <FormGroup legendText="Additional Options">
              <Checkbox 
                id="loadUserInfo" 
                labelText="Load User Info" 
                checked={config.loadUserInfo}
                onChange={() => handleCheckboxChange('loadUserInfo')}
              />
              
              <Checkbox 
                id="automaticSilentRenew" 
                labelText="Automatic Silent Renew" 
                checked={config.automaticSilentRenew}
                onChange={() => handleCheckboxChange('automaticSilentRenew')}
              />
            </FormGroup>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={resetToDefaults} kind="ghost">
              Reset to Default Values
            </Button>
          </div>
        </Form>
        
        <div>
          <h3>Test OIDC Configuration</h3>
          <Stack orientation="horizontal" gap={2}>
            <Button onClick={handleLogin} disabled={loading}>
              Login with Custom Configuration
            </Button>
            
            <Button onClick={testProviderConnectivity} disabled={loading} kind="tertiary">
              Test Provider Connectivity
            </Button>
          </Stack>
          
          {loading && <Loading description="Processing..." />}
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
