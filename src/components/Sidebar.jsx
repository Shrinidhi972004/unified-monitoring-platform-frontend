import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';

const drawerWidth = 220;

export default function Sidebar({ selected, setSelected }) {
  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
    { label: 'Logs', icon: <ListAltIcon />, key: 'logs' },
    // Add more sections here as needed
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {navItems.map(item => (
            <ListItem 
              button 
              key={item.key}
              selected={selected === item.key}
              onClick={() => setSelected(item.key)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
