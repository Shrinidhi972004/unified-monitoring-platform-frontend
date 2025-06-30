import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  IconButton,
  Tooltip,
  Skeleton,
  useTheme,
  alpha,
  Chip
} from '@mui/material';
import { 
  Refresh,
  Storage,
  Assessment,
  Speed,
  Timeline,
  TrendingUp,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  BugReport as DebugIcon
} from '@mui/icons-material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { fetchLogCount, fetchLogCountByService, fetchLogCountByLevel } from '../api';

const CHART_COLORS = {
  primary: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
  service: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
  level: {
    error: '#f56565',
    warn: '#ed8936', 
    warning: '#ed8936',
    info: '#4299e1',
    debug: '#48bb78',
    default: '#a0aec0'
  }
};

const KPI_CARDS = [
  {
    title: 'Total Logs',
    icon: Storage,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    dataKey: 'total'
  },
  {
    title: 'Active Services',
    icon: Assessment,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    dataKey: 'services'
  },
  {
    title: 'Log Levels',
    icon: Speed,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    dataKey: 'levels'
  },
  {
    title: 'Avg per Hour',
    icon: Timeline,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    dataKey: 'avgPerHour'
  }
];

export default function Dashboard() {
  const theme = useTheme();
  const [data, setData] = useState({
    total: 0,
    services: [],
    levels: [],
    loading: true
  });

  const fetchDashboardData = async () => {
    setData(prev => ({ ...prev, loading: true }));
    
    try {
      const [totalRes, servicesRes, levelsRes] = await Promise.all([
        fetchLogCount(),
        fetchLogCountByService(),
        fetchLogCountByLevel()
      ]);

      setData({
        total: totalRes?.count || 0,
        services: servicesRes || [],
        levels: levelsRes || [],
        loading: false
      });
    } catch (error) {
      console.error('Dashboard data fetch failed:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getKPIValue = (dataKey) => {
    switch (dataKey) {
      case 'total':
        return data.total;
      case 'services':
        return data.services.length;
      case 'levels':
        return data.levels.length;
      case 'avgPerHour':
        return Math.round(data.total / 24);
      default:
        return 0;
    }
  };

  const getLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'error': return ErrorIcon;
      case 'warn':
      case 'warning': return WarningIcon;
      case 'info': return InfoIcon;
      case 'debug': return DebugIcon;
      default: return InfoIcon;
    }
  };

  const getLevelColor = (level) => {
    return CHART_COLORS.level[level?.toLowerCase()] || CHART_COLORS.level.default;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ 
          p: 2, 
          bgcolor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {label}: {payload[0].value.toLocaleString()}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      bgcolor: '#fafbfc',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Box sx={{ 
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography 
            variant="h3" 
            fontWeight={700} 
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Analytics Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Real-time monitoring and insights
          </Typography>
        </Box>
        
        <Tooltip title="Refresh Dashboard" arrow>
          <IconButton
            onClick={fetchDashboardData}
            disabled={data.loading}
            sx={{
              bgcolor: alpha('#667eea', 0.1),
              color: '#667eea',
              border: `2px solid ${alpha('#667eea', 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#667eea',
                color: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {KPI_CARDS.map((card, index) => {
          const IconComponent = card.icon;
          const value = getKPIValue(card.dataKey);
          
          return (
            <Grid item xs={12} sm={6} lg={3} key={card.title}>
              <Card sx={{
                background: card.gradient,
                color: 'white',
                height: '140px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: alpha('#fff', 0.1),
                  borderRadius: '50%',
                  transform: 'translate(30px, -30px)'
                }
              }}>
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.9 }}>
                      {card.title}
                    </Typography>
                    <IconComponent sx={{ fontSize: 28, opacity: 0.8 }} />
                  </Box>
                  
                  <Box>
                    {data.loading ? (
                      <Skeleton variant="text" width={80} height={40} sx={{ bgcolor: alpha('#fff', 0.2) }} />
                    ) : (
                      <Typography variant="h3" fontWeight={700}>
                        {value.toLocaleString()}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5, opacity: 0.8 }} />
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Live data
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Services Distribution */}
        <Grid item xs={12} lg={6}>
          <Card sx={{
            height: '500px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
            }
          }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
                Service Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Log volume by service
              </Typography>
              
              <Box sx={{ flexGrow: 1, position: 'relative' }}>
                {data.loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Skeleton variant="circular" width={300} height={300} />
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.services}
                        dataKey="count"
                        nameKey="serviceName"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                      >
                        {data.services.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS.service[index % CHART_COLORS.service.length]} 
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Log Levels Analysis */}
        <Grid item xs={12} lg={6}>
          <Card sx={{
            height: '500px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
            }
          }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
                Log Levels Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Distribution by severity
              </Typography>
              
              <Box sx={{ flexGrow: 1, position: 'relative' }}>
                {data.loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  </Box>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data.levels} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis 
                          dataKey="level" 
                          tick={{ fontSize: 12 }}
                          stroke={theme.palette.text.secondary}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          stroke={theme.palette.text.secondary}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="count" 
                          radius={[4, 4, 0, 0]}
                        >
                          {data.levels.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getLevelColor(entry.level)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    
                    {/* Level Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {data.levels.map((item) => {
                        const IconComponent = getLevelIcon(item.level);
                        return (
                          <Chip
                            key={item.level}
                            icon={<IconComponent sx={{ fontSize: '16px !important' }} />}
                            label={`${item.level.toUpperCase()}: ${item.count.toLocaleString()}`}
                            sx={{
                              bgcolor: alpha(getLevelColor(item.level), 0.1),
                              color: getLevelColor(item.level),
                              border: `1px solid ${alpha(getLevelColor(item.level), 0.3)}`,
                              fontWeight: 600,
                              '& .MuiChip-icon': {
                                color: 'inherit'
                              }
                            }}
                          />
                        );
                      })}
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
