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
    console.log('App is being re-rendered to the DOM.');
  }

  updateLogin = (newLogin) => {
    this.setState({
      isLoggedIn: newLogin
    }, () => {
      console.log('Login state', this.state.isLoggedIn);
      console.log('New login state', newLogin);
    });
    
  }

  render() {
    console.log('Constructor login state', this.state.isLoggedIn);
    return(
      <Router>
        <div>
          {this.state.isLoggedIn ? <h1>Logged in!</h1> : <h1>Not logged in</h1>}
        </div>
        <Switch>
          <Route exact path='/register'>
            <div className='formDisplay'>
              <RegistrationForm />
            </div>
          </Route>
          <Route exact path='/login'>
            <div className='formDisplay'>
              <LoginForm loginFunction={(newLogin) => {this.updateLogin(newLogin)}}/>
            </div>
          </Route>
          <Route exact path='/products'>
            <h1>Welcome to the products page!</h1>
          </Route>
        </Switch>
      </Router>
      
    )
  }
}

export default App;
