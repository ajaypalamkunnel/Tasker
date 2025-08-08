import useAuthStore from '../store/userStore'
import { Navigate, Outlet } from 'react-router-dom'
import Header from '../components/Header'

const PrivateRoutes = () => {
  const isAuthenticated = useAuthStore(state=>state.isAuthenticated)
  
  if(!isAuthenticated){
    return <Navigate to="/login" replace />;
  }

  return(
     <>
      <Header />
      <Outlet />
    </>
  )
}

export default PrivateRoutes