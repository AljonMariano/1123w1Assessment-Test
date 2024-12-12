import { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  const [currentNumber, setCurrentNumber] = useState<string | null>(null);

  const handleSignIn = (twilioNumber: string) => {
    setCurrentNumber(twilioNumber);
    console.log('Signed in with:', twilioNumber); 
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!currentNumber ? (
        <SignIn onSignIn={handleSignIn} />
      ) : (
        <Dashboard currentNumber={currentNumber} />
      )}
    </ThemeProvider>
  );
}

export default App;
