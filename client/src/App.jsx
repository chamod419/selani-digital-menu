import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import MenuPage from './pages/MenuPage.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminMenuItems from './pages/admin/AdminMenuItems.jsx'

import ProtectedRoute from './components/admin/ProtectedRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'

import {
  AuthProvider,
} from './context/AuthContext.jsx'

function ProtectedAdminPage({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={<MenuPage />}
          />

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedAdminPage>
                <AdminDashboard />
              </ProtectedAdminPage>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <ProtectedAdminPage>
                <AdminCategories />
              </ProtectedAdminPage>
            }
          />

          {/* <Route
            path="/admin/menu-items"
            element={
              <ProtectedAdminPage>
                <AdminMenuItems />
              </ProtectedAdminPage>
            }
          /> */}

          <Route
            path="/admin/menu-items"
            element={
              <ProtectedAdminPage>
                <AdminMenuItems />
              </ProtectedAdminPage>
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App