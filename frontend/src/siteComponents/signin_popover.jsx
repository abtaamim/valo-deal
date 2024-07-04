import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Link from '@mui/material/Link';
import { usePopupState, bindHover, bindPopper } from 'material-ui-popup-state/hooks';
import Popper from '@mui/material/Popper';

const SignInPopover = () => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'signInPopover' });

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <div className='signProp' {...bindHover(popupState)}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
          Hello, SignIn
        </Typography>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Account & Lists
          <ArrowDropDownIcon />
        </Typography>
      </div>

      <Popper
        {...bindPopper(popupState)}
        sx={{
          backgroundColor: 'white',
          border: '1px solid black',
          zIndex: 1,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box p={2}>
          {/* <Typography variant="h6">Account Information</Typography>
          <Typography variant="body2">Name: John Doe</Typography>
          <Typography variant="body2">Email: john.doe@example.com</Typography> */}
          <Box mt={2}>
            <Link component={RouterLink} to="/login" underline="hover" onClick={popupState.close}>
              Sign In
            </Link>
          </Box>
          <Box mt={2}>
            <Link component={RouterLink} to="/register" underline="hover" onClick={popupState.close}>
              Sign Up
            </Link>
          </Box>
          <Box mt={1}>
            <Link component={RouterLink} to="/orders" underline="hover" onClick={popupState.close}>
              Previous Orders
            </Link>
          </Box>
          <Box mt={1}>
            <Link component={RouterLink} to="/history" underline="hover" onClick={popupState.close}>
              Browsing History
            </Link>
          </Box>
        </Box>
      </Popper>
    </div>
  );
};

export default SignInPopover;
