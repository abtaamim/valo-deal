import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './page/auth/signIn.jsx'
import Home from './page/home.jsx'
import { AuthProvider } from '../../frontend/src/context/auth.jsx'
import CreateOffer from './page/createOffer.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/signIn', element: <SignIn /> },
      { path: '/', element: <Home /> },
      { path: '/create-offer', element: <CreateOffer /> },
    ],
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
