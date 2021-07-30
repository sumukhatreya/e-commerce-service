import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RegistrationForm from './components/register';
import LoginForm from './components/login';
import ProductList from './components/product/productList';
import ProductPage from './components/product/productPage';
import ProductRatingAndReview from './components/product/productRatingAndReviewPage';
import Cart from './components/cart/cart';
import Checkout from './components/checkout';


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
            <ProductList loginFunction={(newLogin) => {this.updateLogin(newLogin)}}/>
          </Route>
          <Route exact path='/products/:id'>
            <ProductPage loginFunction={(newLogin) => this.updateLogin(newLogin)}/>
          </Route>
          <Route exact path='/products/:id/review'>
            <ProductRatingAndReview loginFunction={(newLogin) => this.updateLogin(newLogin)}/>
          </Route>
          <Route exact path='/cart'>
            <Cart loginFunction={(newLogin) => this.updateLogin(newLogin)}/>
          </Route>
          <Route exact path='/cart/checkout'>
            <Checkout loginFunction={(newLogin) => this.updateLogin(newLogin)}/>
          </Route>
          <Route exact path='/profile'>
            <div>
              <h1>Welcome to the profile page!</h1>
            </div>
          </Route>
          <Route exact path='/sell'>
            <div>
              <h1>Sell an item!</h1>
            </div>
          </Route>
        </Switch>
      </Router>  
    )
  }
}

export default App;
