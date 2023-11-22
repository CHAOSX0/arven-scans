"use client";

import * as React from 'react';

import TextField from '@mui/material/TextField';
import { styled } from '@mui/material';
const Field = styled(TextField)({
  '& label.Mui-focused': {
    color: 'green',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiOutlinedInput-root': {
      borderRadius:'12px',
    '& fieldset': {
      borderColor: '#909090',
      borderWidth:'3px',
      transition:'all 0.35s ease-in-out'
    },
    '&:hover fieldset': {
      borderColor: '#c0c0c0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0352fc',
    },
    '& .MuiInputBase-input':{
          color:'white'
    },
    '& .MuiInputLabel-root':{
          color:'white'
    },
    '& .MuiInputLabel-root.Mui-focused':{
       color:'#0352fc !important'
    }
  },
})
export default Field;
