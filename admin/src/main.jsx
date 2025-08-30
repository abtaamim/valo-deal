import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './page/auth/signIn.jsx'
import Home from './page/home.jsx'
import UserPage from './page/UserPage.jsx'
import ProductPage from './page/ProductPage.jsx'
import OrderPage from './page/OrderPage.jsx'
import { AuthProvider } from '../../frontend/src/context/auth.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          { path: '/users', element: <UserPage /> },
          { path: '/products', element: <ProductPage /> },
          { path: '/orders', element: <OrderPage /> },
        ]
      }
    ],
  },
  { path: '/signIn', element: <SignIn /> }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
