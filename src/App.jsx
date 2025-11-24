import { publicRoutes, protectedRoutes } from '@/config/routes'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {publicRoutes.map((route) => (
            <Route
              path={route.path}
              element={<route.component />}
              key={route.key}
            />
          ))}

          {protectedRoutes.map((route) => (
            <Route
              path={route.path}
              element={
                <ProtectedRoute>
                  <route.component />
                </ProtectedRoute>
              }
              key={route.key}
            />
          ))}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
