import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'

export const publicRoutes = [
  {
    key: 'home',
    path: '/',
    component: HomePage,
  },
  {
    key: 'login',
    path: '/login',
    component: LoginPage,
  },
]
