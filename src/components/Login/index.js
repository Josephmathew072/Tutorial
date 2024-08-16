import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {userid: '', pin: '', showErrorMsg: false, errMsg: ''}

  onChangeUserId = event => {
    this.setState({userid: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitFailure = errMsg => {
    this.setState({errMsg, showErrorMsg: true})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
    this.setState({userid: '', pin: '', showErrorMsg: false})
  }

  getAccount = async event => {
    event.preventDefault()
    const {userid, pin} = this.state

    const userDetails = {user_id: userid, pin}
    const loginUrl = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {errMsg, showErrorMsg, pin, userid} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-form-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-image"
          />
          <form className="form-container" onSubmit={this.getAccount}>
            <h1 className="form-head">Welcome Back</h1>
            <div className="input-container">
              <label className="input-label" htmlFor="userid">
                User ID
              </label>
              <input
                type="text"
                id="userid"
                className="username-input-field"
                value={userid}
                onChange={this.onChangeUserId}
                placeholder="Enter User ID"
                autoComplete="username"
              />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="pin">
                PIN
              </label>
              <input
                type="password"
                id="pin"
                className="username-input-field"
                value={pin}
                onChange={this.onChangePin}
                placeholder="Enter PIN"
                autoComplete="one-time-code"
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg && <p className="error-message">{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
