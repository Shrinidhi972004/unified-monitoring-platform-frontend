import React, { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Avatar, 
  IconButton,
  Badge,
  Tooltip,
  alpha,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Sidebar from './components/Sidebar';
import LogTable from './components/LogTable';
import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';
import Settings from './components/Settings';
import NotificationsDropdown from './components/NotificationsDropdown';
import { fetchSettings, saveSettings } from './api';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

// Create theme based on dark mode preference
const createAppTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#667eea',
      dark: '#764ba2',
    },
    secondary: {
      main: '#f093fb',
      dark: '#f5576c',
    },
    background: {
      default: darkMode ? '#121212' : '#fafbfc',
      paper: darkMode ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: darkMode ? '#ffffff' : '#2c3e50',
      secondary: darkMode ? '#b0b0b0' : '#6c757d',
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: darkMode 
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function AppContent({ darkMode, setDarkMode, alertLevel, setAlertLevel }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selected, setSelected] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getCurrentDrawerWidth = () => {
    if (isMobile) return 0;
    return sidebarCollapsed ? collapsedDrawerWidth : drawerWidth;
  };

  const getPageTitle = () => {
    switch (selected) {
      case 'dashboard':
        return 'Analytics Dashboard';
      case 'logs':
        return 'Application Logs';
      case 'alerts':
        return 'Alerts & Incidents';
      case 'settings':
        return 'Settings & Preferences';
      default:
        return 'Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (selected) {
      case 'dashboard':
        return 'Monitor your system performance and metrics';
      case 'logs':
        return 'View and filter application log entries';
      case 'alerts':
        return 'Manage alerts and incident notifications';
      case 'settings':
        return 'Configure your dashboard preferences';
      default:
        return 'Dashboard overview';
    }
  };

  const handleRefresh = () => {
    // Refresh logic here
    window.location.reload();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        bgcolor: theme.palette.background.default
      }}>
        {/* Sidebar */}
        <Sidebar 
          selected={selected} 
          setSelected={setSelected}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: `calc(100% - ${getCurrentDrawerWidth()}px)`,
            ml: isMobile ? 0 : `${getCurrentDrawerWidth()}px`,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            })
          }}
        >
          {/* Top AppBar */}
          <AppBar 
            position="static" 
            elevation={0}
            sx={{
              bgcolor: theme.palette.background.paper,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              color: 'text.primary'
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
              {/* Left side - Menu + Title */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isMobile && (
                  <IconButton
                    onClick={() => setSidebarOpen(true)}
                    sx={{ 
                      mr: 2,
                      color: 'text.secondary',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                
                {!isMobile && !sidebarCollapsed && (
                  <IconButton
                    onClick={() => setSidebarCollapsed(true)}
                    sx={{ 
                      mr: 2,
                      color: 'text.secondary',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                <Box>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {getPageTitle()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getPageDescription()}
                  </Typography>
                </Box>
              </Box>

              {/* Right side actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Refresh" arrow>
                  <IconButton 
                    onClick={handleRefresh}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>

                <NotificationsDropdown alertLevel={alertLevel} />

                <Tooltip title="Settings" arrow>
                  <IconButton 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Profile" arrow>
                  <IconButton sx={{ p: 0.5 }}>
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36,
                        bgcolor: 'primary.main',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      AD
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Page Content */}
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              overflow: 'auto',
              bgcolor: theme.palette.background.default,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: alpha(theme.palette.divider, 0.1),
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: alpha(theme.palette.text.secondary, 0.3),
                borderRadius: '3px',
                '&:hover': {
                  bgcolor: alpha(theme.palette.text.secondary, 0.5),
                }
              }
            }}
          >
            {selected === 'dashboard' && <Dashboard />}
            {selected === 'logs' && <LogTable />}
            {selected === 'alerts' && <Alerts />}
            {selected === 'settings' && (
              <Settings 
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                alertLevel={alertLevel}
                setAlertLevel={setAlertLevel}
              />
            )}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [alertLevel, setAlertLevel] = useState('WARN_ERROR');
  const theme = createAppTheme(darkMode);

  // Fetch persisted settings on first load
  useEffect(() => {
    fetchSettings()
      .then(s => {
        if (s) {
          setDarkMode(Boolean(s.darkMode));
          setAlertLevel(s.alertLevel || 'WARN_ERROR');
        }
      })
      .catch(() => {
        // Fallback: use defaults
        console.log('Using default settings - no saved settings found');
      });
  }, []);

  // Save settings to backend whenever changed
  useEffect(() => {
    // Skip saving on initial render to avoid saving defaults before loading
    const timeoutId = setTimeout(() => {
      saveSettings({ darkMode, alertLevel })
        .catch(error => {
          console.error('Failed to save settings:', error);
        });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [darkMode, alertLevel]);

  return (
    <ThemeProvider theme={theme}>
      <AppContent 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        alertLevel={alertLevel}
        setAlertLevel={setAlertLevel}
      />
    </ThemeProvider>
  );
}
