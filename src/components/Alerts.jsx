import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Stack,
  Grid,
  alpha,
  useTheme,
  IconButton,
  Divider,
  Badge,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from "@mui/material";
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Visibility as ViewIcon,
  VisibilityOff as UnreadIcon,
  FilterList as FilterIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  BugReport as BugIcon
} from "@mui/icons-material";
import { fetchAlerts, markAlertAsRead } from "../api";

// Mock data for development - remove when API is ready
const mockAlerts = [
  {
    id: 1,
    level: "ERROR",
    message: "Database connection timeout on user authentication service",
    timestamp: "2024-01-15T14:30:22Z",
    relatedService: "auth-service",
    read: false,
    category: "Database",
    impact: "High"
  },
  {
    id: 2,
    level: "WARN",
    message: "High memory usage detected on payment processing service",
    timestamp: "2024-01-15T14:25:15Z",
    relatedService: "payment-service",
    read: false,
    category: "Performance",
    impact: "Medium"
  },
  {
    id: 3,
    level: "INFO",
    message: "Scheduled maintenance completed successfully",
    timestamp: "2024-01-15T13:45:30Z",
    relatedService: "maintenance",
    read: true,
    category: "Maintenance",
    impact: "Low"
  },
  {
    id: 4,
    level: "ERROR",
    message: "API rate limit exceeded for external service integration",
    timestamp: "2024-01-15T13:20:45Z",
    relatedService: "integration-service",
    read: true,
    category: "API",
    impact: "High"
  },
  {
    id: 5,
    level: "WARN",
    message: "SSL certificate expires in 7 days",
    timestamp: "2024-01-15T12:00:00Z",
    relatedService: "security",
    read: false,
    category: "Security",
    impact: "Medium"
  }
];

export default function Alerts() {
  const theme = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await fetchAlerts();
      // Fallback to mock data if API fails
      setAlerts(data.length > 0 ? data : mockAlerts);
    } catch (error) {
      console.error("Failed to load alerts:", error);
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    // Poll for new alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = alerts;
    if (filter === 'unread') {
      filtered = alerts.filter(alert => !alert.read);
    } else if (filter === 'error') {
      filtered = alerts.filter(alert => alert.level === 'ERROR');
    } else if (filter === 'warning') {
      filtered = alerts.filter(alert => alert.level === 'WARN');
    }
    setFilteredAlerts(filtered);
  }, [alerts, filter]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAlertAsRead(id);
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      ));
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    }
  };

  const getAlertIcon = (level) => {
    switch (level) {
      case 'ERROR':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'WARN':
        return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'INFO':
        return <InfoIcon sx={{ color: '#2196f3' }} />;
      default:
        return <InfoIcon sx={{ color: '#2196f3' }} />;
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'ERROR':
        return 'error';
      case 'WARN':
        return 'warning';
      case 'INFO':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return timestamp?.replace("T", " ").slice(0, 19) || "Unknown";
    }
  };

  const getStats = () => {
    const total = alerts.length;
    const unread = alerts.filter(a => !a.read).length;
    const errors = alerts.filter(a => a.level === 'ERROR').length;
    const warnings = alerts.filter(a => a.level === 'WARN').length;
    
    return { total, unread, errors, warnings };
  };

  const stats = getStats();

  const StatCard = ({ title, value, icon, color, gradient }) => (
    <Card 
      sx={{ 
        height: '100%',
        background: gradient,
        color: 'white',
        border: 'none',
        boxShadow: `0 4px 20px ${alpha(color, 0.3)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${alpha(color, 0.4)}`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 500 }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ 
            p: 2, 
            bgcolor: alpha('#fff', 0.2), 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const FilterButton = ({ label, value, active, count }) => (
    <Button
      variant={active ? "contained" : "outlined"}
      onClick={() => setFilter(value)}
      sx={{
        borderRadius: 2,
        px: 3,
        py: 1,
        fontWeight: 600,
        textTransform: 'none',
        ...(active ? {
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' }
        } : {
          borderColor: alpha(theme.palette.divider, 0.3),
          color: 'text.secondary',
          '&:hover': { 
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderColor: 'primary.main'
          }
        })
      }}
      endIcon={count > 0 && (
        <Chip 
          label={count} 
          size="small" 
          sx={{ 
            height: 20, 
            minWidth: 20,
            bgcolor: active ? alpha('#fff', 0.2) : alpha(theme.palette.primary.main, 0.1),
            color: active ? 'white' : 'primary.main'
          }} 
        />
      )}
    >
      {label}
    </Button>
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
          Alerts & Incidents
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage system alerts and incident notifications
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Alerts"
            value={stats.total}
            icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
            color="#667eea"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unread"
            value={stats.unread}
            icon={<UnreadIcon sx={{ fontSize: 28 }} />}
            color="#f093fb"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Errors"
            value={stats.errors}
            icon={<ErrorIcon sx={{ fontSize: 28 }} />}
            color="#ff6b6b"
            gradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Warnings"
            value={stats.warnings}
            icon={<WarningIcon sx={{ fontSize: 28 }} />}
            color="#feca57"
            gradient="linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)"
          />
        </Grid>
      </Grid>

      {/* Filter Controls */}
      <Card sx={{ mb: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Filter Alerts:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <FilterButton 
                label="All" 
                value="all" 
                active={filter === 'all'} 
                count={stats.total}
              />
              <FilterButton 
                label="Unread" 
                value="unread" 
                active={filter === 'unread'} 
                count={stats.unread}
              />
              <FilterButton 
                label="Errors" 
                value="error" 
                active={filter === 'error'} 
                count={stats.errors}
              />
              <FilterButton 
                label="Warnings" 
                value="warning" 
                active={filter === 'warning'} 
                count={stats.warnings}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Loading alerts...</Typography>
            </Box>
          ) : filteredAlerts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {filter === 'all' ? 'No alerts to show.' : `No ${filter} alerts found.`}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredAlerts.map((alert, index) => (
                <React.Fragment key={alert.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      transition: 'all 0.2s ease',
                      bgcolor: alert.read ? 'transparent' : alpha(theme.palette.primary.main, 0.02),
                      borderLeft: !alert.read ? `4px solid ${
                        alert.level === 'ERROR' ? '#f44336' : 
                        alert.level === 'WARN' ? '#ff9800' : '#2196f3'
                      }` : 'none',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      {getAlertIcon(alert.level)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {alert.relatedService || "System"}
                          </Typography>
                          <Chip
                            label={alert.level}
                            size="small"
                            color={getAlertColor(alert.level)}
                            sx={{ fontWeight: 600 }}
                          />
                          {alert.category && (
                            <Chip
                              label={alert.category}
                              size="small"
                              variant="outlined"
                              sx={{ borderColor: alpha(theme.palette.divider, 0.3) }}
                            />
                          )}
                          {!alert.read && (
                            <Badge 
                              color="primary" 
                              variant="dot" 
                              sx={{ 
                                '& .MuiBadge-dot': { 
                                  width: 8, 
                                  height: 8,
                                  borderRadius: '50%'
                                } 
                              }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                            {alert.message}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {formatTimestamp(alert.timestamp)}
                              </Typography>
                            </Box>
                            {alert.impact && (
                              <Chip
                                label={`${alert.impact} Impact`}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  height: 20,
                                  fontSize: '0.7rem',
                                  borderColor: alpha(theme.palette.divider, 0.3)
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      {!alert.read ? (
                        <Tooltip title="Mark as read" arrow>
                          <IconButton
                            onClick={() => handleMarkAsRead(alert.id)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Chip
                          label="Read"
                          size="small"
                          sx={{ 
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: 'success.main',
                            fontWeight: 500
                          }}
                        />
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredAlerts.length - 1 && (
                    <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
