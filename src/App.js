import React from 'react';
import './styles/index.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Main from './Main';
import Header from './Header';
import ToTrack from './ToTrack';
import Cost from './Cost';
import Departments from './Departments';

function App() {
  return (
    <div className="App">

      <Router>
        <Link to="/">
          <Header />
        </Link>
        <Route exact path="/">
          <Main />
        </Route>
        <div className="wrapper">
          <Switch>
            <Route path="/to-track">
              <ToTrack />
            </Route>
            <Route path="/cost">
              <Cost />
            </Route>
            <Route path="/departments">
              <Departments />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
