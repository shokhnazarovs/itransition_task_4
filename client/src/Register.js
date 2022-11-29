import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Register() {
    const [message, setMessage] = useState('');
    const [isPending, setPending] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(event){
      event.preventDefault();
      setPending(true);
      let data = {
        fname: event.target.fname.value,
        lname: event.target.lname.value,
        email: event.target.email.value,
        password: event.target.password.value
      };
      fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(data)
      })
        .then(function(response) {
          setPending(false);
          if(response.ok){ navigate('/');}
          else if(response.status === 403 || response.status === 406){
            setMessage('Unable to register');
          } else if(response.status === 409){
            setMessage('This email was registered, please log in');
          }
        })
        .catch(function(error) {
        console.log("fetching failed with error message: ", error);
        });
    }

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-floating my-2">
          <input name="fname" type="text" className="form-control" id="floatingfname" placeholder="First name" required />
          <label htmlFor="floatingfname">First name</label>
        </div>
        <div className="form-floating my-2">
          <input name="lname" type="text" className="form-control" id="floatinglname" placeholder="Last name" required />
          <label htmlFor="floatinglname">Last name</label>
        </div>
        <div className="form-floating my-2">
          <input name="email" type="email" className="form-control" id="floatingInput" placeholder="name@example.com" required />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating my-2">
          <input name="password" type="password" className="form-control" id="floatingPassword" placeholder="Password" required />
          <label htmlFor="floatingPassword">Password</label>
        </div>
    
        <div className="authMessage mb-3">{message}</div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">{(isPending) ? 'Loading...' : 'Sign up'}</button>
      </form>
    );
  }
  
  export default Register;
  