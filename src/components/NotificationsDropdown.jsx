import React, { useState, useEffect } from "react";
import { 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Tooltip, 
  Typography, 
  Box, 
  Chip,
  Divider,
  alpha,
  useTheme
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { fetchUnreadAlerts, markAlertAsRead } from "../api"; // update the path as needed

export default function NotificationsDropdown({ alertLevel = 'ALL' }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [alerts, setAlerts] = useState([]);
  // Removed filteredAlerts - we'll show all alerts now
  const [previousTotalCount, setPreviousTotalCount] = useState(0);
  const [shouldPulse, setShouldPulse] = useState(false);
  const open = Boolean(anchorEl);

  const loadAlerts = async () => {
    try {
      const data = await fetchUnreadAlerts();
      setAlerts(data || []);
    } catch (error) {
      console.error("Failed to load alerts:", error);
      // Fallback to mock data for testing
      const mockAlerts = [
        {
          id: 1,
          level: 'ERROR',
          message: 'Database connection timeout',
          timestamp: '2024-01-15T14:30:22Z',
          relatedService: 'auth-service',
          read: false
        },
        {
          id: 2,
          level: 'WARN',
          message: 'High memory usage detected',
          timestamp: '2024-01-15T14:25:15Z',
          relatedService: 'payment-service',
          read: false
        }
      ];
      setAlerts(mockAlerts);
    }
  };

  // REMOVED: Filter alerts based on alertLevel preference
  // Now showing ALL unread alerts regardless of level
  /* 
  useEffect(() => {
    let filtered = alerts;
    
    switch (alertLevel) {
      case 'ERROR':
        filtered = alerts.filter(alert => alert.level?.toUpperCase() === 'ERROR');
        break;
      case 'WARN_ERROR':
        filtered = alerts.filter(alert => ['WARN', 'WARNING', 'ERROR'].includes(alert.level?.toUpperCase()));
        break;
      case 'INFO_WARN_ERROR':
        filtered = alerts.filter(alert => ['INFO', 'WARN', 'WARNING', 'ERROR'].includes(alert.level?.toUpperCase()));
        break;
      case 'ALL':
        filtered = alerts; // Show all alerts
        break;
      default:
        filtered = alerts.filter(alert => ['WARN', 'WARNING', 'ERROR'].includes(alert.level?.toUpperCase()));
    }
    
    console.log(`Filtering ${alerts.length} alerts with level "${alertLevel}" -> ${filtered.length} filtered alerts`);
    setFilteredAlerts(filtered);
  }, [alerts, alertLevel]);
  */

  // Animation effect to trigger when TOTAL alert count increases
  useEffect(() => {
    const currentTotalCount = alerts.length;
    
    if (currentTotalCount > previousTotalCount && previousTotalCount >= 0) {
      setShouldPulse(true);
      // Reset pulse after animation duration
      setTimeout(() => {
        setShouldPulse(false);
      }, 600);
    }
    setPreviousTotalCount(currentTotalCount);
  }, [alerts.length, previousTotalCount]);

  useEffect(() => {
    loadAlerts();
    // Polling interval for live updates
    const interval = setInterval(loadAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Remove debug code for production
  /*
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        testPulseAnimation();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  */

  // Debug: Simulate receiving new alerts for testing (remove in production)
  /* 
  useEffect(() => {
    const simulateNewAlert = () => {
      console.log('Simulating new alert...');
      const newAlert = {
        id: Date.now(),
        level: 'ERROR',
        message: `Simulated alert at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
        relatedService: 'test-service',
        read: false
      };
      
      setAlerts(prev => [...prev, newAlert]);
    };

    // Simulate new alerts every 15 seconds for testing
    const simulationInterval = setInterval(simulateNewAlert, 15000);
    
    return () => clearInterval(simulationInterval);
  }, []);
  */

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    loadAlerts();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await markAlertAsRead(alertId);
      
      // Immediately update local state to reflect the change
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
      // Also reload from server to ensure consistency
      setTimeout(() => {
        loadAlerts();
      }, 500);
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
      // Still reload alerts in case of error to sync with server
      loadAlerts();
    }
  };

  // Remove debug function for production
  /*
  const testPulseAnimation = () => {
    console.log('Testing pulse animation...');
    setShouldPulse(true);
    setTimeout(() => setShouldPulse(false), 600);
  };
  */

  return (
    <>
      <Tooltip title={`${alerts.length} unread notification${alerts.length !== 1 ? 's' : ''}`} arrow>
        <IconButton 
          onClick={handleMenuOpen}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
            // Pulse animation keyframes
            ...(shouldPulse && {
              animation: 'notificationPulse 0.6s ease-in-out',
              '@keyframes notificationPulse': {
                '0%': {
                  transform: 'scale(1)',
                  backgroundColor: 'transparent',
                },
                '30%': {
                  transform: 'scale(1.15)',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
                '60%': {
                  transform: 'scale(1.05)',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
                '100%': {
                  transform: 'scale(1)',
                  backgroundColor: 'transparent',
                }
              }
            })
          }}
        >
          <Badge 
            badgeContent={alerts.length} 
            color="error"
            showZero={false}
            max={99}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{ 
          style: { 
            maxHeight: 400, 
            width: "380px",
            marginTop: "8px"
          },
          sx: {
            '& .MuiMenuItem-root': {
              whiteSpace: 'normal',
              alignItems: 'flex-start'
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {alerts.length} unread alert{alerts.length !== 1 ? 's' : ''} (all levels)
          </Typography>
        </Box>

        {alerts.length === 0 ? (
          <MenuItem disabled sx={{ py: 3, justifyContent: 'center' }}>
            <Typography color="text.secondary" textAlign="center">
              No new alerts
            </Typography>
          </MenuItem>
        ) : (
          alerts.flatMap((alert, index) => {
            const menuItems = [
              <MenuItem
                key={alert.id}
                onClick={() => handleMarkAsRead(alert.id)}
                sx={{ 
                  py: 2,
                  px: 2,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={alert.level?.toUpperCase() || 'UNKNOWN'}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 20,
                        mr: 1,
                        bgcolor: (() => {
                          const level = (alert.level || '').toUpperCase();
                          switch (level) {
                            case 'ERROR':
                              return 'error.main';
                            case 'WARN':
                            case 'WARNING':
                              return 'warning.main';
                            case 'INFO':
                              return 'info.main';
                            case 'DEBUG':
                              return 'grey.600';
                            case 'TRACE':
                              return 'grey.500';
                            default:
                              return 'primary.main';
                          }
                        })(),
                        color: 'white'
                      }}
                    />
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                      {alert.relatedService || 'System'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Unknown time'}
                  </Typography>
                </Box>
              </MenuItem>
            ];
            
            // Add divider if not the last item
            if (index < alerts.length - 1) {
              menuItems.push(
                <Divider 
                  key={`divider-${alert.id}`} 
                  sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} 
                />
              );
            }
            
            return menuItems;
          })
        )}
      </Menu>
    </>
  );
}
