import { Box, Paper, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';

interface SignInProps {
  onSignIn: (twilioNumber: string) => void;
}

function SignIn({ onSignIn }: SignInProps) {
  const [selectedNumber, setSelectedNumber] = useState('');

  useEffect(() => {
    console.log('SignIn component mounted'); // Debug log
  }, []);

  const twilioNumbers = [
    { label: 'Test Number 1', value: '+13613392529' }, // Use actual numbers instead of env vars for now
    { label: 'Test Number 2', value: '+13613227495' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit clicked with number:', selectedNumber); // Debug log
    if (selectedNumber) {
      onSignIn(selectedNumber);
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f5f5f5' 
    }}>
      <Paper sx={{ p: 4, maxWidth: '400px', width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Select Twilio Test Number
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Number</InputLabel>
            <Select
              value={selectedNumber}
              label="Select Number"
              onChange={(e) => setSelectedNumber(e.target.value)}
            >
              {twilioNumbers.map((number, index) => (
                <MenuItem key={index} value={number.value}>
                  {number.label} ({number.value})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
            size="large"
            disabled={!selectedNumber}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default SignIn; 