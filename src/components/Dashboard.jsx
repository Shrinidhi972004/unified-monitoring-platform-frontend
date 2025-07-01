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
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
        width: '100%'
      }}>
        {/* Service Distribution Chart */}
        <Card sx={{
          flex: 1,
          minHeight: '500px',
          maxHeight: '500px',
          transition: 'all 0.3s ease',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
          }
        }}>
          <CardContent sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            p: 3
          }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
                Service Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Log volume by service across all applications
              </Typography>
            </Box>
            
            <Box sx={{ 
              flexGrow: 1, 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {data.loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Skeleton variant="circular" width={280} height={280} />
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
                      innerRadius={70}
                      outerRadius={130}
                      paddingAngle={3}
                      label={({ name, percent }) => 
                        percent > 5 ? `${name}\n${(percent * 100).toFixed(1)}%` : ''
                      }
                      labelLine={false}
                    >
                      {data.services.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS.service[index % CHART_COLORS.service.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: '12px',
                        paddingTop: '10px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Log Levels Analysis Chart */}
        <Card sx={{
          flex: 1,
          minHeight: '500px',
          maxHeight: '500px',
          transition: 'all 0.3s ease',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
          }
        }}>
          <CardContent sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            p: 3
          }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
                Log Levels Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Distribution by severity and log level types
              </Typography>
            </Box>
            
            <Box sx={{ 
              flexGrow: 1, 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {data.loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </Box>
              ) : (
                <>
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={data.levels} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={alpha(theme.palette.divider, 0.3)}
                          vertical={false}
                        />
                        <XAxis 
                          dataKey="level" 
                          tick={{ fontSize: 12, fontWeight: 500 }}
                          stroke={theme.palette.text.secondary}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          stroke={theme.palette.text.secondary}
                          axisLine={false}
                          tickLine={false}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="count" 
                          radius={[6, 6, 0, 0]}
                          maxBarSize={60}
                        >
                          {data.levels.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#gradient-${entry.level})`}
                            />
                          ))}
                        </Bar>
                        <defs>
                          {data.levels.map((entry) => {
                            const color = getLevelColor(entry.level);
                            return (
                              <linearGradient
                                key={`gradient-${entry.level}`}
                                id={`gradient-${entry.level}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                              </linearGradient>
                            );
                          })}
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                  
                  {/* Level Tags */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mt: 2,
                    pt: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    {data.levels.map((item) => {
                      const IconComponent = getLevelIcon(item.level);
                      return (
                        <Chip
                          key={item.level}
                          icon={<IconComponent sx={{ fontSize: '14px !important' }} />}
                          label={`${item.level.toUpperCase()}: ${item.count.toLocaleString()}`}
                          size="small"
                          sx={{
                            bgcolor: alpha(getLevelColor(item.level), 0.1),
                            color: getLevelColor(item.level),
                            border: `1px solid ${alpha(getLevelColor(item.level), 0.2)}`,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            '& .MuiChip-icon': {
                              color: 'inherit'
                            },
                            '&:hover': {
                              bgcolor: alpha(getLevelColor(item.level), 0.2),
                              transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease'
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
      </Box>
    </Box>
  );
}
