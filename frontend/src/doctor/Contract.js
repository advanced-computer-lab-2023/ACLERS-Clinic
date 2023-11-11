import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const AcceptContract = () => {
  const [docID, setDocID] = useState('');
  const [contractID, setContractID] = useState('');
  const [message, setMessage] = useState('');

  const handleAcceptContract = async () => {
    try {
     
     const response=   await fetch('/acceptcontract',{
            method:'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contractID),
          })
     
     
        if (response.status === 200) {
        setMessage('Contract accepted successfully');
      } else {
        setMessage('Error accepting contract');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while processing the request');
    }
  };

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

        <TextField
          label="contractid"
          variant="outlined"
          value={contractID}
          onChange={(e)=>{setContractID(e.target.value)}}
        />
     
        <Button variant="contained" color="primary" onClick={handleAcceptContract}>
      AcceptContract
        </Button>
        
       
      </Box>
    </Container>
  
  );
};

export default AcceptContract;