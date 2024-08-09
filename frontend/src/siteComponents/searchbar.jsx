import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import TextTransition from './transitionTextSearchBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);


  const [inputValue, setInputValue] = useState(''); //typing inside searchbar

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log('Input value:', event.target.value); 
  };

  const clearInput = () => {
    setInputValue('');  
    setIsFocused(false);
    console.log('hoina'); 
  };
  const theme = useTheme();

  const lessThan850px = useMediaQuery('(max-width:1000px)'); 


  return (
    <Paper
      variant='outlined'
      component="form"
      sx={{bgcolor:'rgb(24, 26, 27)', borderRadius: '40px', p: '2px 4px', display: 'flex', alignItems: 'center', width: 600, height: 50, mt: '14px' }}
    >
      
      <InputBase
        sx={{ ml: 1, flex: 1, bgcolor:'rgb(24, 26, 27)',color:'rgb(173, 181, 189)'  }}
        // placeholder={lessThan850px ? 'Search' : ''}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        
        
       // inputProps={{ 'aria-label': 'search google maps' }}
        startAdornment={
          <InputAdornment position="start">
            {!isFocused && <SearchIcon sx={{color: 'rgb(173, 181, 189)'}} />}
          </InputAdornment>
        }
      />
      {!isFocused && inputValue === '' && (
        <div className='placeholder-text'>
        <TextTransition  />
        </div>
      )}
      {inputValue && (
        <IconButton sx={{ p: '10px' }} aria-label="clear" onClick={clearInput}>
          <CloseIcon sx={{color: 'rgb(173, 181, 189)'}}/>
        </IconButton>
      )}

      <Button variant="contained" disableElevation 
      startIcon={lessThan850px &&<SearchIcon sx={{marginLeft:'6px',height:'25px', color:'blue'}}/>}
        sx={{
          borderRadius: '40px',
          width: lessThan850px ? '4px' : 'auto',
          backgroundColor: 'darkorange',
          '&:hover': {
            backgroundColor: 'rgb(0, 7, 20)',
          },
        }}>
         {!lessThan850px && 'Search'}
      </Button>

    </Paper>
  );
}
