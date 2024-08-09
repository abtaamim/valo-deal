import * as React from 'react';
import {Pagination, PaginationItem } from '@mui/material';
import { Link } from 'react-router-dom';
import Pagination_styles from './Pagination_styles';
const Paginate=()=>{
  const classes = Pagination_styles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return(
    <Pagination
    classes={{ul: classes.ul}}
    count={5}
    page={1}
    variant='outlined'
    shape='rounded'
    color='primary'
    renderItem={(item)=>(
      <PaginationItem {...item} component={Link} to={`/posts?page=${1}`}/>
    )}
    
    
    />
  )
}
export default Paginate; 