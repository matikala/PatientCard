import React from 'react';
import { Typography, AppBar, Toolbar } from '@material-ui/core'

const NavBar = () => {
    return (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">
                Patients List
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
    );
  };
  
  export default NavBar;