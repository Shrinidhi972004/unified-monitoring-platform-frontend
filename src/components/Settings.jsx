import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Grid,
  Divider,
  alpha,
  useTheme,
  Paper,
  Stack
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const Settings = ({ darkMode, setDarkMode, alertLevel, setAlertLevel }) => {
  const theme = useTheme();

  const alertLevelOptions = [
    { value: 'ERROR', label: 'Only ERROR', description: 'Show only critical error alerts' },
    { value: 'WARN_ERROR', label: 'WARN & ERROR', description: 'Show warnings and errors' },
    { value: 'INFO_WARN_ERROR', label: 'INFO, WARN & ERROR', description: 'Show info, warnings and errors' },
    { value: 'ALL', label: 'ALL', description: 'Show all alert levels including debug' }
  ];

  const SettingCard = ({ title, description, icon, children, gradient }) => (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.1)}`
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2,
              background: gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
              {description}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto' }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Settings & Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your dashboard experience and notification preferences
        </Typography>
      </Box>

      {/* Settings Grid */}
      <Grid container spacing={3}>
        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <SettingCard
            title="Theme Preferences"
            description="Switch between light and dark mode for optimal viewing comfort"
            icon={darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            gradient={darkMode 
              ? "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
              : "linear-gradient(135deg, #f39c12 0%, #e74c3c 100%)"
            }
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LightModeIcon sx={{ color: darkMode ? 'text.secondary' : 'warning.main' }} />
                <Typography variant="body1" fontWeight={500}>
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </Typography>
                <DarkModeIcon sx={{ color: darkMode ? 'primary.main' : 'text.secondary' }} />
              </Box>
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'primary.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: 'primary.main',
                  },
                }}
              />
            </Box>
            
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Typography variant="caption" color="primary.main" fontWeight={600}>
                💡 Tip: Dark mode reduces eye strain during extended monitoring sessions
              </Typography>
            </Box>
          </SettingCard>
        </Grid>

        {/* Alert Level Settings */}
        <Grid item xs={12} md={6}>
          <SettingCard
            title="Alert Level Preferences"
            description="Configure which alert levels you want to see in notifications"
            icon={<NotificationsIcon />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          >
            <FormControl fullWidth>
              <InputLabel id="alert-level-label" sx={{ fontWeight: 500 }}>
                Alert Level Filter
              </InputLabel>
              <Select
                labelId="alert-level-label"
                value={alertLevel}
                label="Alert Level Filter"
                onChange={(e) => setAlertLevel(e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              >
                {alertLevelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}>
              <Typography variant="caption" color="info.main" fontWeight={600}>
                🔔 Current: {alertLevelOptions.find(opt => opt.value === alertLevel)?.label}
              </Typography>
            </Box>
          </SettingCard>
        </Grid>

        {/* System Information */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    color: 'white',
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SettingsIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    System Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dashboard configuration and system status
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      v1.0.0
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dashboard Version
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} color="success.main">
                      Online
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      System Status
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      bgcolor: alpha(theme.palette.info.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} color="info.main">
                      3
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Active Monitors
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} color="warning.main">
                      99.9%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Uptime
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Secure connection established
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaletteIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Theme: {darkMode ? 'Dark' : 'Light'} Mode Active
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon sx={{ color: 'info.main', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Alerts: {alertLevelOptions.find(opt => opt.value === alertLevel)?.label}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
