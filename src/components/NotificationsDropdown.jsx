import React, { useState, useEffect } from "react";
import { IconButton, Badge, Menu, MenuItem, ListItemText, Tooltip, Typography, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { fetchUnreadAlerts, markAlertAsRead } from "../api"; // update the path as needed

export default function NotificationsDropdown({ alertLevel = 'WARN_ERROR' }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const open = Boolean(anchorEl);

  const loadAlerts = async () => {
    const data = await fetchUnreadAlerts();
    setAlerts(data);
  };

  // Filter alerts based on alertLevel preference
  useEffect(() => {
    let filtered = alerts;
    
    switch (alertLevel) {
      case 'ERROR':
        filtered = alerts.filter(alert => alert.level === 'ERROR');
        break;
      case 'WARN_ERROR':
        filtered = alerts.filter(alert => ['WARN', 'ERROR'].includes(alert.level));
        break;
      case 'INFO_WARN_ERROR':
        filtered = alerts.filter(alert => ['INFO', 'WARN', 'ERROR'].includes(alert.level));
        break;
      case 'ALL':
        filtered = alerts; // Show all alerts
        break;
      default:
        filtered = alerts.filter(alert => ['WARN', 'ERROR'].includes(alert.level));
    }
    
    setFilteredAlerts(filtered);
  }, [alerts, alertLevel]);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    loadAlerts();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (alertId) => {
    await markAlertAsRead(alertId);
    loadAlerts();
  };

  return (
    <>
      <Tooltip title="Notifications" arrow>
        <IconButton 
          onClick={handleMenuOpen}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Badge badgeContent={filteredAlerts.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{ style: { maxHeight: 350, width: "360px" } }}
      >
        {filteredAlerts.length === 0 ? (
          <MenuItem disabled>
            <Typography color="text.secondary">
              {alerts.length === 0 ? 'No new alerts' : 'No alerts matching your preferences'}
            </Typography>
          </MenuItem>
        ) : (
          filteredAlerts.map((alert) => (
            <MenuItem
              key={alert.id}
              onClick={() => handleMarkAsRead(alert.id)}
              divider
            >
              <Box>
                <Typography variant="subtitle2" color={alert.level === "ERROR" ? "error" : "warning.main"}>
                  {alert.level} — {alert.relatedService}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {alert.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {alert.timestamp?.replace("T", " ").slice(0, 19)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
