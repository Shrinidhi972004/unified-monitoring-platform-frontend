import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper } from '@mui/material';
import { fetchLogs } from '../api';
import LogFilter from './LogFilter';
import dayjs from 'dayjs';

export default function LogTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState('');
  const [service, setService] = useState('');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  // Fetch logs when any filter changes
  useEffect(() => {
    setLoading(true);
    fetchLogs({
      page: 0,
      size: 10,
      ...(level && { level }),
      ...(service && { serviceName: service }),
      ...(start && { start: dayjs(start).toISOString() }),
      ...(end && { end: dayjs(end).toISOString() }),
    })
      .then(data => setLogs(data.content))
      .finally(() => setLoading(false));
  }, [level, service, start, end]); // Triggers on any filter change

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'serviceName', headerName: 'Service', width: 140 },
    { field: 'level', headerName: 'Level', width: 100 },
    { field: 'message', headerName: 'Message', width: 320 },
    { field: 'timestamp', headerName: 'Timestamp', width: 200 },
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight={600} color="primary.main">
          Unified Application Log Viewer
        </Typography>
        <LogFilter
          service={service} setService={setService}
          level={level} setLevel={setLevel}
          start={start} setStart={setStart}
          end={end} setEnd={setEnd}
        />
        <div style={{ height: 430, width: '100%' }}>
          <DataGrid
            rows={logs}
            columns={columns}
            loading={loading}
            getRowId={row => row.id}
            pageSize={10}
            sx={{
              fontSize: 16,
              '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5' },
              '& .MuiDataGrid-cell': { py: 1.2 },
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
