import useAuthStore from '../store/userStore'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute  = () => {
  const isAuthenticated = useAuthStore(state=>state.isAuthenticated)
  return !isAuthenticated ? <Outlet/> : <Navigate to="/" replace/>
}

export default PublicRoute 