import React, { useState } from 'react';
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
  useMediaQuery
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

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selected, setSelected] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getCurrentDrawerWidth = () => {
    if (isMobile) return 0;
    return sidebarCollapsed ? collapsedDrawerWidth : drawerWidth;
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
        bgcolor: '#fafbfc'
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
              bgcolor: 'white',
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
                    {selected === 'dashboard' ? 'Analytics Dashboard' : 'Application Logs'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selected === 'dashboard' 
                      ? 'Monitor your system performance and metrics' 
                      : 'View and filter application log entries'
                    }
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

                <Tooltip title="Notifications" arrow>
                  <IconButton 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  >
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

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
              bgcolor: '#fafbfc',
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
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
