import {Redirect, Route} from 'react-router-dom'
import Cookie from 'js-cookie'

const ProtectedRoute = props => {
  const token = Cookie.get('jwt_token')
  if (!token) {
    return <Redirect to="/ebank/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute
