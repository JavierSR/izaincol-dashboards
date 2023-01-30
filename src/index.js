import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import {
  createHashRouter,
  RouterProvider,
} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Login from './views/Login'
import Dashboard from './views/Dashboard'
import PersonQuery from './views/PersonQuery'
import GroupQuery from './views/GroupQuery'

const router = createHashRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/consulta-certificados-persona',
    element: <PersonQuery />
  },
  {
    path: '/consulta-certificados-equipo',
    element: <GroupQuery />
  },
])


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

reportWebVitals()
