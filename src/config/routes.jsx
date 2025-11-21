import Home from '@/pages/home'
import Login from '@/pages/login'

export const publicRoutes = [
  {
    key: 'home',
    path: '/',
    component: Home,
  },
  {
    key: 'login',
    path: '/login',
    component: Login,
  },
]
