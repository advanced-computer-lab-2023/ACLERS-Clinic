import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Wallet = () => {
  const [wallet, setwallet] = useState(0);

  return (
    <Container
      style={{
        backgroundColor: 'lightblue',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '5px',
          boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
        }}
      >
<Typography>wallet</Typography>
       
     
<Typography>{wallet}</Typography>
       
      </Box>
    </Container>
  
  );
};

export default Wallet;