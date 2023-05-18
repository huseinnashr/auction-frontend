import { Navigate, Outlet } from "react-router-dom"

interface ProtectedRouteProps {
  accessible: boolean
  redirect: string
}
export const ProtectedRoute = (props: ProtectedRouteProps) => {
  return props.accessible ? <Outlet /> : <Navigate to={props.redirect} replace />
}