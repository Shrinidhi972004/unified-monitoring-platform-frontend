import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Sidebar from './components/Sidebar';
import LogTable from './components/LogTable';
import Dashboard from './components/Dashboard'; // We'll add this if not already

const drawerWidth = 220;

export default function App() {
  const [selected, setSelected] = useState('dashboard');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar selected={selected} setSelected={setSelected} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#f7f7f9',
            p: 3,
            ml: `${drawerWidth}px`
          }}
        >
          <Toolbar />
          {selected === 'dashboard' && <Dashboard />}
          {selected === 'logs' && <LogTable />}
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
