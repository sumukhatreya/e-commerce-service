import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RegistrationForm from './components/register'


class App extends React.Component {

  render() {
    return(
      <Router>
        <Switch>
          <Route path='/register'>
            <div className='form-display'>
              <RegistrationForm />
            </div>

          </Route>
        </Switch>
      </Router>
      
    )
  }
}

export default App;
