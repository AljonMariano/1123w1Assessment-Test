import { Box, Grid, Paper, Typography } from '@mui/material';
import { 
  Chat as ChatIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Phone as PhoneIcon 
} from '@mui/icons-material';
import { useState } from 'react';
import Chat from './Chat';

interface DashboardProps {
  currentNumber: string;
}

const modules = [
  { name: 'Chat', icon: ChatIcon, color: '#1976d2' },
  { name: 'Email', icon: EmailIcon, color: '#2e7d32' },
  { name: 'SMS', icon: SmsIcon, color: '#ed6c02' },
  { name: 'Voice Call', icon: PhoneIcon, color: '#9c27b0' }
];

function Dashboard({ currentNumber }: DashboardProps) {
  const [activeModule, setActiveModule] = useState('Chat');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={3} key={module.name}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                bgcolor: activeModule === module.name ? module.color : 'white',
                color: activeModule === module.name ? 'white' : 'black',
                '&:hover': {
                  bgcolor: module.color,
                  color: 'white',
                }
              }}
              onClick={() => setActiveModule(module.name)}
            >
              <module.icon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{module.name}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2, mt: 2 }}>
          {activeModule === 'Chat' && <Chat currentNumber={currentNumber} />}
          {activeModule === 'Email' && <div>Email Module (Coming Soon)</div>}
          {activeModule === 'SMS' && <div>SMS Module (Coming Soon)</div>}
          {activeModule === 'Voice Call' && <div>Voice Call Module (Coming Soon)</div>}
        </Paper>
      </Grid>
    </Box>
  );
}

export default Dashboard;