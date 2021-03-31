import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RegistrationForm from './components/register';
import LoginForm from './components/login';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false
    };
  }

  updateLogin = () => {
    this.setState({
      isLoggedIn: true
    })
  }

  render() {
    return(
      <Router>
        <Switch>
          <Route path='/register'>
            <div className='formDisplay'>
              <RegistrationForm />
            </div>
          </Route>
          <Route path='/login'>
            <div className='formDisplay'>
              <LoginForm />
            </div>
          </Route>
        </Switch>
      </Router>
      
    )
  }
}

export default App;
