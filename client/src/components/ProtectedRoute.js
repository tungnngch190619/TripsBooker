import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = (props) => {
    const {conditional, redirect} = props
    return(
        conditional === true ? <Outlet/> : redirect
    )
}

export default ProtectedRoute