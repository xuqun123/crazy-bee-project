import * as React from 'react'
import {useState} from 'react'
import Button from '@mui/material/Button'
  
function Signup() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }
    return (
        <div className="card-container">
        <div className="card-body">
          <h1 className="card-title">Sign up</h1>
          <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
              <label htmlFor='InputName'>User Name</label>
              <input
              type="text"
              className='InputName'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}>
              </input>
          </div>
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
            <div className="form-group">
              <label htmlFor="InputPassword">Password</label>
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
              SIGN UP
            </button>
          </form>
          <Button href='login'>Already have an account? Login HERE</Button>
        </div>
    </div>
    )
}

export default Signup