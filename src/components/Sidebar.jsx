import React from 'react';
import { 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box,
  Typography,
  alpha,
  useTheme,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Article as LogsIcon,
  Analytics as AnalyticsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

const navigationItems = [
  { 
    label: 'Dashboard', 
    icon: DashboardIcon, 
    key: 'dashboard',
    description: 'Overview & Analytics'
  },
  { 
    label: 'Logs', 
    icon: LogsIcon, 
    key: 'logs',
    description: 'Application Logs'
  }
];

export default function Sidebar({ 
  selected, 
  setSelected, 
  open, 
  onClose, 
  collapsed, 
  onToggleCollapsed, 
  isMobile 
}) {
  const theme = useTheme();
  const currentWidth = collapsed ? collapsedDrawerWidth : drawerWidth;

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Logo/Brand Section */}
      <Box sx={{ 
        p: collapsed ? 1.5 : 3, 
        borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
        mb: 2,
        minHeight: collapsed ? 64 : 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: theme.transitions.create(['padding', 'min-height'], {
          duration: theme.transitions.duration.shorter,
        })
      }}>
        {collapsed ? (
          <AnalyticsIcon sx={{ 
            fontSize: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'transparent',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text'
          }} />
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AnalyticsIcon sx={{ 
                fontSize: 32, 
                mr: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'transparent',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text'
              }} />
              <Typography variant="h5" fontWeight={700} sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                LogMonitor
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), ml: 5 }}>
              Analytics Platform
            </Typography>
          </Box>
        )}
      </Box>

      {/* Collapse Toggle Button */}
      {!isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: collapsed ? 'center' : 'flex-end',
          px: collapsed ? 0 : 2,
          pb: 1
        }}>
          <IconButton
            onClick={onToggleCollapsed}
            sx={{
              color: alpha('#fff', 0.6),
              '&:hover': {
                bgcolor: alpha('#fff', 0.05),
                color: '#667eea'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ px: collapsed ? 1 : 2, flex: 1 }}>
        {!collapsed && (
          <Typography 
            variant="overline" 
            sx={{ 
              color: alpha('#fff', 0.4),
              fontWeight: 600,
              letterSpacing: 1,
              ml: 2,
              mb: 1,
              display: 'block'
            }}
          >
            NAVIGATION
          </Typography>
        )}
        
        <List sx={{ p: 0 }}>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = selected === item.key;
            
            return (
              <Tooltip
                key={item.key}
                title={collapsed ? item.label : ''}
                placement="right"
                arrow
              >
                <ListItemButton
                  selected={isSelected}
                  onClick={() => setSelected(item.key)}
                  sx={{
                    mb: 1,
                    mx: collapsed ? 0.5 : 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 2,
                    '&.Mui-selected': {
                      bgcolor: alpha('#667eea', 0.15),
                      color: '#667eea',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        bgcolor: '#667eea',
                        borderRadius: '0 2px 2px 0'
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#667eea'
                      }
                    },
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.05),
                      transform: collapsed ? 'scale(1.05)' : 'translateX(8px)',
                      '& .MuiListItemIcon-root': {
                        color: isSelected ? '#667eea' : alpha('#fff', 0.9)
                      }
                    },
                    '& .MuiListItemIcon-root': {
                      color: isSelected ? '#667eea' : alpha('#fff', 0.6),
                      minWidth: collapsed ? 'auto' : 40,
                      transition: 'color 0.3s ease',
                      justifyContent: 'center'
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#667eea' : alpha('#fff', 0.8)
                    },
                    '& .MuiListItemText-secondary': {
                      color: isSelected ? alpha('#667eea', 0.7) : alpha('#fff', 0.4)
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 40 }}>
                    <IconComponent sx={{ fontSize: 22 }} />
                  </ListItemIcon>
                  
                  {!collapsed && (
                    <ListItemText 
                      primary={item.label}
                      secondary={item.description}
                      primaryTypographyProps={{
                        variant: 'body1',
                        sx: { transition: 'all 0.3s ease' }
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        sx: { transition: 'all 0.3s ease' }
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      {!collapsed && (
        <Box sx={{ 
          mt: 'auto', 
          p: 2, 
          borderTop: `1px solid ${alpha('#fff', 0.1)}`,
          bgcolor: alpha('#000', 0.2)
        }}>
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.4) }}>
            Version 1.0.0
          </Typography>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1a1d29',
            color: 'white',
            borderRight: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: currentWidth,
          boxSizing: 'border-box',
          bgcolor: '#1a1d29',
          color: 'white',
          borderRight: 'none',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
