import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import AllDrawer from './all_sidebar';
import CustomLink from './CustomLink';
export default function SecondNavbar(){

  return(
    <nav className="secondNav">
      <ul>
        
          <AllDrawer/>
          <CustomLink to="/sell" >Sell</CustomLink>
        <li></li>

      </ul>


    </nav>
  )


}


