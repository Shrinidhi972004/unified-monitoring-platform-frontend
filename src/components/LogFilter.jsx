import React, { useEffect, useState } from 'react';
import { Toolbar, TextField, Box, MenuItem } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { fetchLogLevels, fetchServices } from '../api';

export default function LogFilter({
  service, setService,
  level, setLevel,
  start, setStart,
  end, setEnd,
  onFilter
}) {
  // State to store options
  const [serviceOptions, setServiceOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);

  useEffect(() => {
    fetchServices().then(setServiceOptions).catch(() => setServiceOptions([]));
    fetchLogLevels().then(setLevelOptions).catch(() => setLevelOptions([]));
  }, []);

  return (
    <Toolbar sx={{ gap: 2, mb: 2 }}>
      <TextField
        select
        label="Service"
        value={service}
        onChange={e => setService(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">All</MenuItem>
        {serviceOptions.map(svc => (
          <MenuItem key={svc} value={svc}>{svc}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Level"
        value={level}
        onChange={e => setLevel(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ minWidth: 100 }}
      >
        <MenuItem value="">All</MenuItem>
        {levelOptions.map(lvl => (
          <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
        ))}
      </TextField>
      <DateTimePicker
        label="Start"
        value={start}
        onChange={setStart}
        sx={{ minWidth: 200 }}
      />
      <DateTimePicker
        label="End"
        value={end}
        onChange={setEnd}
        sx={{ minWidth: 200 }}
      />
    </Toolbar>
  );
}
