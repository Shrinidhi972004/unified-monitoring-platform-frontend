import React, { useEffect, useState } from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Button, 
  Grid, 
  Typography,
  IconButton,
  Tooltip,
  Autocomplete
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Search, Clear, Refresh } from '@mui/icons-material';
import { fetchLogLevels, fetchServices } from '../api';

export default function LogFilter({
  service, setService,
  level, setLevel,
  start, setStart,
  end, setEnd,
  onFilter,
}) {
  const [serviceOptions, setServiceOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);

  useEffect(() => {
    fetchServices().then(setServiceOptions).catch(() => setServiceOptions([]));
    fetchLogLevels().then(setLevelOptions).catch(() => setLevelOptions([]));
  }, []);

  // Trigger filtering automatically on filter change
  useEffect(() => {
    if (onFilter) onFilter();
    // eslint-disable-next-line
  }, [service, level, start, end]);

  const handleClear = () => {
    setService('');
    setLevel('');
    setStart(null);
    setEnd(null);
  };

  const handleRefresh = () => {
    if (onFilter) onFilter();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
        Filter Options
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2.2}>
          <Autocomplete
            freeSolo
            options={serviceOptions}
            value={service}
            onChange={(event, newValue) => setService(newValue || '')}
            onInputChange={(event, newInputValue) => setService(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Service"
                variant="outlined"
                size="small"
                placeholder="Type or select service"
                sx={{ minWidth: 150 }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={1.8}>
          <Autocomplete
            freeSolo
            options={levelOptions}
            value={level}
            onChange={(event, newValue) => setLevel(newValue || '')}
            onInputChange={(event, newInputValue) => setLevel(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Level"
                variant="outlined"
                size="small"
                placeholder="Type or select level"
                sx={{ minWidth: 120 }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.8}>
          <DateTimePicker
            label="Start Date"
            value={start}
            onChange={setStart}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                sx: { minWidth: 200 }
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.8}>
          <DateTimePicker
            label="End Date"
            value={end}
            onChange={setEnd}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                sx: { minWidth: 200 }
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={2.4}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleRefresh}
              sx={{ flexGrow: 1, minWidth: 80 }}
            >
              Search
            </Button>
            <Tooltip title="Clear filters">
              <IconButton 
                onClick={handleClear}
                color="default"
                sx={{ border: 1, borderColor: 'divider' }}
              >
                <Clear />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton 
                onClick={handleRefresh}
                color="primary"
                sx={{ border: 1, borderColor: 'primary.main' }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
