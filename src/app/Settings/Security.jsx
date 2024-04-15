import React, { useContext, useState } from 'react'
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { AuthContext } from '@/context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase-config';

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

const Security = () => {
    const {currentUser} = useContext(AuthContext)
    const profileView = currentUser.profileView  === "private" ? true : false
    const [checked, setChecked] = useState(profileView)

    const handleChange = async() =>{
        const newChecked = !checked;
        setChecked(newChecked)

        const profileViewRef = doc(db, "users", currentUser.uid);

        await updateDoc(profileViewRef, {
            profileView: newChecked ? "private" : "public"
        });

        alert(newChecked ? "Private mode activated" : "Public mode activated")
    }

    return (
        <div className=''>
            <div className='text-sm py-5 border-b flex items-center justify-between'>
                <div className="">
                    <h1 className='font-bold'>Private Mode</h1>
                    <p className="">Make your account private</p>
                </div>
                <FormGroup>
                    <FormControlLabel 
                        control={<IOSSwitch sx={{ m: 1 }} checked={checked} onChange={handleChange}/>} 
                        label={checked} />
                </FormGroup>
            </div>
        </div>
    )
}

export default Security