import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  Chip,
  Avatar
} from '@mui/material';
import { fetchLogs } from '../api';
import LogFilter from './LogFilter';
import dayjs from 'dayjs';

export default function LogTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState('');
  const [service, setService] = useState('');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  // Fetch logs with current filters
  const getLogs = useCallback(() => {
    setLoading(true);
    fetchLogs({
      page: 0,
      size: 50,
      ...(level && { level }),
      ...(service && { serviceName: service }),
      ...(start && { start: dayjs(start).toISOString() }),
      ...(end && { end: dayjs(end).toISOString() }),
    })
      .then(data => setLogs(data.content || []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [level, service, start, end]);

  // Initial load
  useEffect(() => {
    getLogs();
  }, [getLogs]);

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error': return 'error';
      case 'warn': case 'warning': return 'warning';
      case 'info': return 'info';
      case 'debug': return 'default';
      default: return 'default';
    }
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: 'serviceName', 
      headerName: 'Service', 
      width: 160,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          variant="outlined" 
          size="small"
          avatar={<Avatar sx={{ width: 24, height: 24 }}>{params.value?.charAt(0)}</Avatar>}
        />
      )
    },
    { 
      field: 'level', 
      headerName: 'Level', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getLevelColor(params.value)}
          size="small"
          variant="filled"
        />
      )
    },
    { 
      field: 'message', 
      headerName: 'Message', 
      flex: 1,
      minWidth: 400,
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          height: '100%',
          py: 1
        }}>
          <Typography variant="body2" sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 200,
      renderCell: (params) => {
        if (!params.value) return '--';
        
        try {
          const timestamp = dayjs(params.value);
          const now = dayjs();
          const diffMinutes = now.diff(timestamp, 'minute');
          const diffHours = now.diff(timestamp, 'hour');
          const diffDays = now.diff(timestamp, 'day');
          
          let relativeTime = '';
          
          if (diffMinutes < 1) {
            relativeTime = 'Just now';
          } else if (diffMinutes < 60) {
            relativeTime = `${diffMinutes}m ago`;
          } else if (diffHours < 24) {
            relativeTime = `${diffHours}h ago`;
          } else if (diffDays < 7) {
            relativeTime = `${diffDays}d ago`;
          } else {
            relativeTime = timestamp.format('MMM DD');
          }
          
          return (
            <Box sx={{ 
              textAlign: 'left', 
              py: 0.5,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%'
            }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 500, 
                fontSize: '0.875rem',
                lineHeight: 1.2,
                mb: 0.25
              }}>
                {timestamp.format('MMM DD, HH:mm')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ 
                fontSize: '0.75rem',
                lineHeight: 1
              }}>
                {relativeTime}
              </Typography>
            </Box>
          );
        } catch (error) {
          console.error('Error formatting timestamp:', error, params.value);
          return (
            <Typography variant="body2" color="error">
              Invalid date
            </Typography>
          );
        }
      },
    },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
          Application Logs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and analyze application logs in real-time
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent sx={{ pb: 2 }}>
          <LogFilter
            service={service} setService={setService}
            level={level} setLevel={setLevel}
            start={start} setStart={setStart}
            end={end} setEnd={setEnd}
            onFilter={getLogs}
          />
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <DataGrid
              rows={logs}
              columns={columns}
              loading={loading}
              getRowId={row => row.id}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              disableRowSelectionOnClick
              getRowHeight={() => 72}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': { 
                  backgroundColor: 'grey.50',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  fontWeight: 600
                },
                '& .MuiDataGrid-cell': { 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '2px solid',
                  borderColor: 'divider',
                  backgroundColor: 'grey.50'
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
