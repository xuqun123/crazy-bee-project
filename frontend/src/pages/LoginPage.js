import * as React from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button'

function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(this.state)
  }
  return (
    <div className="card-container">
      <div className="card-body">
        <h1 className="card-title">Log in</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="InputEmail">Email</label>
            <input
              type="email"
              className="form-control"
              id="InputEmail"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword">Password</label>
            <input
              type="password"
              className="form-control"
              id="InputPassword"
              placeholder="***********"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">
            LOG IN
          </button>
        </form>
        <Button href="/passwordEmailLink">Forgot password?</Button>
        <Button href="/signup">Don't have an account? Sign up HERE</Button>
      </div>
    </div>
  )
}

export default Login
