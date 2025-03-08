import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Loading,
  CodeSnippet,
  Header,
  HeaderName,
  HeaderGlobalAction,
} from '@carbon/react';
import { Logout } from '@carbon/react/icons';
import authService from '../services/authService';
import logger from '../utils/logger';

const TokenViewer = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getUser();
        if (!user) {
          logger.info('No user found, redirecting to home...');
          navigate('/');
          return;
        }
        logger.info('User data retrieved successfully');
        setUserData(user);
      } catch (error) {
        logger.error('Error fetching user data:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      logger.info('Logging out...');
      await authService.logout();
      // The OIDC provider will redirect to the configured post_logout_redirect_uri
    } catch (error) {
      logger.error('Logout failed:', error);
      navigate('/');
    }
  };

  if (loading) {
    return <Loading description="Loading token data..." />;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  // Create a flat list of claims for the DataTable
  const headers = [
    { key: 'claim', header: 'Claim' },
    { key: 'value', header: 'Value' },
  ];
  
  const tableData = Object.entries(userData.profile).map(([key, value]) => ({
    id: key,
    claim: key,
    value: typeof value === 'object' ? JSON.stringify(value) : String(value),
  }));

  return (
    <div className="token-viewer">
      <Header aria-label="OIDC Token Viewer">
        <HeaderName href="#" prefix="OIDC">
          Token Viewer
        </HeaderName>
        <HeaderGlobalAction aria-label="Logout" onClick={handleLogout} title="Logout">
          <Logout size={20} />
        </HeaderGlobalAction>
      </Header>

      <div className="token-content">
        <h2>ID Token Claims</h2>
        <DataTable rows={tableData} headers={headers}>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>

        <h2>Raw ID Token</h2>
        <CodeSnippet type="multi" feedback="Copied to clipboard">
          {userData.id_token}
        </CodeSnippet>

        <h2>Raw Access Token</h2>
        <CodeSnippet type="multi" feedback="Copied to clipboard">
          {userData.access_token}
        </CodeSnippet>
      </div>
    </div>
  );
};

export default TokenViewer;
