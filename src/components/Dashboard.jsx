import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { fetchLogCount, fetchLogCountByService, fetchLogCountByLevel } from '../api';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [byService, setByService] = useState([]);
  const [byLevel, setByLevel] = useState([]);

  useEffect(() => {
    fetchLogCount().then(res => setTotal(res.count || 0));
    fetchLogCountByService().then(setByService);
    fetchLogCountByLevel().then(setByLevel);
  }, []);

  return (
    <Box sx={{ maxWidth: 950, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" fontWeight={600} color="primary.main" gutterBottom>
        Monitoring Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">Total Logs</Typography>
              <Typography variant="h3" color="secondary">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Logs by Service</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={byService}
                    dataKey="count"
                    nameKey="serviceName"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {byService.map((entry, idx) => (
                      <Cell key={entry.serviceName} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Logs by Level</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byLevel}>
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Bar dataKey="count" fill="#8884d8" />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
