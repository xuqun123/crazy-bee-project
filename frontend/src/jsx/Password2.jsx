import * as React from 'react'
import {useState} from 'react'

export const Password2 = () => {
    const [pass, setPass] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
    }
 
    return (
      <div className="card-container">
          <div className="card-body">
            <h1 className="card-title">Log in</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="InputPassword">New password</label>
                <input
                  type="password"
                  className="form-control"
                  id="InputPassword"
                  placeholder='***********'
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="InputPassword">Comfirm password</label>
                <input
                  type="password"
                  className="form-control"
                  id="InputPassword"
                  placeholder='***********'
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn"
              >
                CONFIRM
              </button>
            </form>
          </div>
      </div>
    )
}