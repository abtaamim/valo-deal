import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSearch } from '../context/SearchContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const theme = useTheme();
  const lessThan850px = useMediaQuery('(max-width:1000px)');
  const { keyword } = useParams();
  //console.log("keyword+++", keyword);
  //console.log("values.keyword", values.keyWord);
  const isXs = useMediaQuery('(max-width:450px)');
  const axiosPrivate = useAxiosPrivate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.keyWord.trim()) return;
    try {
      const res = await axiosPrivate.get(`/search/${values.keyWord}`);
      {
        auth.user ? await axiosPrivate.post('/search/searched-items', {
          searchTerm: values.keyWord
        }) : null
      }
      setValues({ ...values, results: res.data.results });
      navigate(`/search/${values.keyWord}`); // Update the URL
    } catch (error) {
    //  console.log('Error:', error);
    }
  };

  // Clear input field
  const clearInput = () => {
    setValues({ ...values, keyWord: '' });
    setIsFocused(false);
  };

  return (
    <Paper
      variant="outlined"
      component="form"
      sx={{ bgcolor: 'rgb(24, 26, 27)', borderRadius: '40px', p: '2px 4px', display: 'flex', alignItems: 'center', minWidth: '300px', width: { xs: 350, md: 600 }, height: 50, mt: '14px' }}
      onSubmit={handleSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, bgcolor: 'rgb(24, 26, 27)', color: 'rgb(173, 181, 189)' }}
        value={values.keyWord}
        onChange={(e) => setValues({ ...values, keyWord: e.target.value })}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
        placeholder={!isFocused ? 'Search...' : ''}
        startAdornment={
          !isXs && (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'rgb(173, 181, 189)' }} />
            </InputAdornment>
          )
        }
      />
      {values.keyWord && (
        <IconButton sx={{ p: '10px' }} aria-label="clear" onClick={clearInput}>
          <CloseIcon sx={{ color: 'rgb(173, 181, 189)' }} />
        </IconButton>
      )}
      <Button
        variant="contained"
        disableElevation
        startIcon={lessThan850px && <SearchIcon sx={{ marginLeft: '6px', height: '25px', color: 'blue' }} />}
        sx={{
          borderRadius: '40px',
          width: lessThan850px ? '4px' : 'auto',
          backgroundColor: 'darkorange',
          '&:hover': {
            backgroundColor: 'rgb(0, 7, 20)',
          },
        }}
        onClick={handleSubmit}
      >
        {!lessThan850px && 'Search'}
      </Button>
    </Paper>
  );
}
export default SearchBar