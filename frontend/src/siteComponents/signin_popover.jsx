import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Link from '@mui/material/Link';
import { usePopupState, bindHover, bindPopper } from 'material-ui-popup-state/hooks';
import Popper from '@mui/material/Popper';
import { useAuth } from '../context/auth';

const SignInPopover = () => {
  const [auth, setAuth] = useAuth();
  const popupState = usePopupState({ variant: 'popover', popupId: 'signInPopover' });

  const handleSignOut = () => {
    // Perform sign-out logic, e.g., clear user data, redirect, etc.
    setAuth({ user: null, token: null });
    localStorage.removeItem('auth');
    popupState.close();
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <div className='signProp' {...bindHover(popupState)}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
          {auth.user ? `Hello, ${auth.user.name}` : 'Hello, SignIn'}
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
          {!auth.user ? (
            <Box mt={2}>
              <Link component={RouterLink} to="/login" underline="hover" onClick={popupState.close}>
                Sign In
              </Link>
            </Box>
          ) : (
            <>
              <Typography variant="h6">Account Information</Typography>
              <Typography variant="body2">Name: {auth.user.name}</Typography>
              <Typography variant="body2">Email: {auth.user.email}</Typography>
              {/* <Box mt={2}>
                <Link component={RouterLink} to="/account" underline="hover" onClick={popupState.close}>
                  My Account
                </Link>
              </Box> */}
              <Box mt={2}>
                <Link component={RouterLink} to="/orders" underline="hover" onClick={popupState.close}>
                  Previous Orders
                </Link>
              </Box>
              <Box mt={1}>
                <Link component={RouterLink} to="/history" underline="hover" onClick={popupState.close}>
                  Browsing History
                </Link>
              </Box>
              <Box mt={1}>
                <Link component={RouterLink} to="/added-items" underline="hover" onClick={popupState.close}>
                  Added Items for sell
                </Link>
              </Box>
              <Box mt={1}>
                <Link component="button" underline="hover" onClick={handleSignOut}>
                  Sign Out
                </Link>
              </Box>
            </>
          )}
        </Box>
      </Popper>
    </div>
  );
};

export default SignInPopover;
