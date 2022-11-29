import Authenticate from './Authenticate';
import Home  from './Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={ <Authenticate />} />
        <Route path="*" element={
          <div>
            <h1>404</h1>
            <h3>Page not found!</h3>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


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