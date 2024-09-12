import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Link from "@mui/material/Link";
import {
  usePopupState,
  bindHover,
  bindPopper,
} from "material-ui-popup-state/hooks";
import Popper from "@mui/material/Popper";
import { useAuth } from "../context/auth";
import { Divider, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";

const SignInPopover = ({ className }) => {
  const [auth, setAuth] = useAuth();
  const popupState = usePopupState({
    variant: "popover",
    popupId: "signInPopover",
  });
  const navigate = useNavigate();
  const isXs = useMediaQuery("(max-width:450px)");
  const handleSignOut = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
    navigate("/");
    popupState.close();
  };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <div {...bindHover(popupState)}>
        <Typography
          variant={isXs ? "h9" : "h6"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            whiteSpace: "nowrap",
          }}
        >
          {isXs ? (
            auth.user ? (
              <>
                {auth.user.name}
                <Person2OutlinedIcon sx={{ fontSize: "30px" }} />
              </>
            ) : (
              <Person2OutlinedIcon />
            )
          ) : auth.user ? (
            `Hello, ${auth.user.name}`
          ) : (
            "Hello, SignIn"
          )}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {!isXs ? "Account & Lists" : null}
        </Typography>
      </div>

      <Popper
        {...bindPopper(popupState)}
        sx={{
          backgroundColor: "aliceblue",
          border: "1px solid black",
          zIndex: 2500,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box p={0} sx={{ width: "250px" }}>
          {!auth.user ? (
            <Box mt={2} p={2}>
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                onClick={popupState.close}
              >
                Sign In
              </Link>
            </Box>
          ) : (
            <>
              <Box p={2} sx={{ bgcolor: "rgb(0, 6, 12)" }}>
                <Typography
                  variant="subtitle1" // Reduced font size
                  sx={{ color: "rgba(230, 230, 230, 0.788)" }}
                >
                  Account Information
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(230, 230, 230, 0.788)" }}
                >
                  Name: {auth.user.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: "2px", color: "rgba(230, 230, 230, 0.788)" }} 
                >
                  Email: {auth.user.email}
                </Typography>
              </Box>

              <ListItemButton
                component={RouterLink}
                to="/Profile"
                underline="hover"
                onClick={popupState.close}
                sx={{
                  fontSize: "16px", 
                  color: "aliceblue",
                  bgcolor: "rgb(0, 6, 12)",
                  "&:hover": {
                    backgroundColor: "rgb(27, 37, 54)",
                    color: "rgb(5, 205, 255)",
                  },
                }}
              >
                My Account
              </ListItemButton>


              <ListItemButton
                component={RouterLink}
                to="/cart"
                underline="hover"
                onClick={popupState.close}
                sx={{
                  fontSize: "16px", 
                  color: "aliceblue",
                  bgcolor: "rgb(0, 6, 12)",
                  "&:hover": {
                    backgroundColor: "rgb(27, 37, 54)",
                    color: "rgb(5, 205, 255)",
                  },
                }}
              >
                Cart
              </ListItemButton>
              <ListItemButton
                component={RouterLink}
                to="/orders"
                underline="hover"
                onClick={popupState.close}
                sx={{
                  fontSize: "16px", 
                  color: "aliceblue",
                  bgcolor: "rgb(0, 6, 12)",
                  "&:hover": {
                    backgroundColor: "rgb(27, 37, 54)",
                    color: "rgb(5, 205, 255)",
                  },
                }}
              >

                Previous Orders
              </ListItemButton>

              <ListItemButton
                component={RouterLink}
                to="/recently-viewed"
                underline="hover"
                onClick={popupState.close}
                sx={{
                  fontSize: "16px", 
                  color: "aliceblue",
                  bgcolor: "rgb(0, 6, 12)",
                  "&:hover": {
                    backgroundColor: "rgb(27, 37, 54)",
                    color: "rgb(5, 205, 255)",
                  },
                }}
              >
                Browsing History
              </ListItemButton>

              <ListItemButton
                component={RouterLink}
                to="/added-items"
                underline="hover"
                onClick={popupState.close}
                sx={{
                  fontSize: "16px", 
                  color: "aliceblue",
                  bgcolor: "rgb(0, 6, 12)",
                  "&:hover": {
                    backgroundColor: "rgb(27, 37, 54)",
                    color: "rgb(5, 205, 255)",
                  },
                }}
              >
                Added Items for Sell
              </ListItemButton>

              <ListItemButton
                component={RouterLink}
                to="/"
                underline="hover"
                onClick={handleSignOut}
                sx={{
                  fontSize: "16px", 
                  color: "aliceblue",
                  bgcolor: "rgb(0, 6, 12)",
                  "&:hover": {
                    bgcolor: "rgb(27, 37, 54)",
                    color: "red",
                  },
                }}
              >
                Sign Out
              </ListItemButton>
            </>
          )}
        </Box>
      </Popper>
    </div>
  );
};

export default SignInPopover;
