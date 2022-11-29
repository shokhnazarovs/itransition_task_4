import Login from './Login';
import Register from './Register';
import { useState } from 'react';

function Authenticate() {

  const [loginState, setLogin] = useState('btn btn-outline-primary active');
  const [registerState, setRegister] = useState('btn btn-outline-primary');
  const [loginTab, setTab] = useState(true);

  function handleClick(buttonName){
    if(buttonName === 'login'){
      setLogin('btn btn-outline-primary active');
      setRegister('btn btn-outline-primary');
      setTab(true);
    } else {
      setLogin('btn btn-outline-primary');
      setRegister('btn btn-outline-primary active');
      setTab(false);
    }
  }

  return (
    <main className="form-signin w-100 m-auto">
      <h2 className="mb-3">Task 4</h2>
      <div className="container mb-4">
        <div className="btn-group" role="group">
          <button type="button" className={loginState} onClick={()=> handleClick('login')}>Login</button>
          <button type="button" className={registerState} onClick={()=> handleClick('register')}>Register</button>
        </div>
      </div>
      {loginTab && <Login />}
      {!loginTab && <Register />}
    </main>
  );
}

export default Authenticate;


  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );