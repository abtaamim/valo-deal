import React from 'react'
import Header from './Header'
import Footer from '../Footer'
import { Helmet } from "react-helmet";
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-toastify';

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
      <Toaster />
      {/* <toast /> */}

        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "valodeal.com",
  description: "mern stack project",
  keywords: "mern,react,boostrap,node,express,mongodb",
  author: "valodeal.com",
};
export default Layout
