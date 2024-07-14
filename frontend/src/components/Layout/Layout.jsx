import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <h1></h1>
      </header>
      <main>{children}</main>
      <footer>
        <p></p>
      </footer>
    </div>
  );
};

export default Layout;
