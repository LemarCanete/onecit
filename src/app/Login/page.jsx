import React from 'react'

const Login = () => {
  return (
    <div className="flex h-screen w-screen bg-slate-50">
        <div className='bg-slate-50 w-screen flex flex-col log-in-page'>
          <div className='flex log-in-mode'><h1>Log In</h1> | <h1>Sign Up</h1></div>
          <div className='line'> Email: <input type='email'/></div>
          <div> Password <input type='password'/> </div>

          <button className='buttons-log-in'> Log In </button>
        </div>


        <div className='bg-slate-500 w-screen'>
          Image
        </div>
    </div>
  )
}

export default Login
