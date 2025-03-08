import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Content, Theme, Loading } from '@carbon/react';
import TokenViewer from './components/TokenViewer';
import Callback from './components/Callback';
import HomePage from './components/HomePage';
import Login from './components/Login';
import DebugLogin from './components/DebugLogin';
import authService from './services/authService';
import './App.scss';

// Protected route component to check authentication
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <Content><Loading description="Checking authentication..." /></Content>;
  }
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Theme theme="g100">
      <Router>
        <Content>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/debug" element={<DebugLogin />} />
            <Route 
              path="/token" 
              element={
                <ProtectedRoute>
                  <TokenViewer />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Content>
      </Router>
    </Theme>
  );
}

export default App;
