import * as React from 'react'
import {useState} from 'react'
import Button from '@mui/material/Button'

export const Password1 = () => {
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
    }
 
    return (
      <div className="card-container">
          <div className="card-body">
            <h1 className="card-title">Reset your password</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="InputEmail">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="InputEmail"
                  placeholder='email@gmail.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn"
              >
                Send reset link
              </button>
            </form>
            <Button href='login'>Back to Log in</Button>
          </div>
      </div>
    )
}