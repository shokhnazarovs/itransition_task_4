import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
  const [message, setMessage] = useState('');
  const [isPending, setPending] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(event){
    event.preventDefault();
    setPending(true);

    let data = {
      email: event.target.email.value,
      password: event.target.password.value
    };
    fetch('/login-data', {
      method: 'POST',
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify(data)
    })
      .then(function(response) {
        setPending(false);
        if(response.ok){ navigate('/');}
        else if(response.status === 403){
          setMessage('Your account suspended!');
        } else if(response.status === 401){
          setMessage('Wrong password or login');
        }
      })
      .catch(function(error) {
        console.log("fetching failed with error message: ", error);
        setPending(false);
      });
  }

  return (
      <form onSubmit={handleSubmit}>
        <div className="form-floating my-2">
          <input name="email" type="email" className="form-control" id="floatingInput" placeholder="name@example.com" required />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating my-2">
          <input name="password" type="password" className="form-control" id="floatingPassword" placeholder="Password" required />
          <label htmlFor="floatingPassword">Password</label>
        </div>
    
        <div className="authMessage mb-3">{message}</div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">{(isPending) ? 'Loading...' : 'Sign in'}</button>
      </form>
  );
}

export default Login;
