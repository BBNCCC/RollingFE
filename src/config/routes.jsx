import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'

export const protectedRoutes = [
  {
    key: 'home',
    path: '/',
    component: HomePage,
  },
]

export const publicRoutes = [
  {
    key: 'login',
    path: '/login',
    component: LoginPage,
  },
]
