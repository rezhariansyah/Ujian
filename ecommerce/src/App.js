import React, { Component } from 'react';
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Product from './components/productlist'
import Manage from './components/Admin/manageProduct'
import PageNotFound from './components/pageNotfound'
import ProductDetail from './components/productDetail'
import ScrollToTop from './components/scrollToTop'
import History from './components/historyTransaksi'
import Cart from './components/cart'
// withRoutier untuk tersambung ke reducer dengan connect, tapi di dalam komponen ada routing
import { Route, withRouter, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import cookie from 'universal-cookie'
import { keepLogin,cookieChecked } from './1.actions'
import './App.css';

const objCookie = new cookie()
class App extends Component {
  componentDidMount() {
    var terserah = objCookie.get('userData')
    if(terserah !== undefined) {
      this.props.keepLogin(terserah)
    } else {
      this.props.cookieChecked()
    }
  }

  render() {
    if(this.props.cookie) {
      return (
        <div>
            <Navbar/>          
            <ScrollToTop>
            <Switch>
            <Route path='/' component={Home} exact/>
            <Route path='/login' component={Login} exact/>
            <Route path='/register' component={Register} exact/>
            <Route path='/product' component={Product} exact/>
            <Route path='/manage' component={Manage} exact/>
            <Route path='/product-detail/:id' component={ProductDetail} exact/>
            <Route path='/cart' component={Cart} exact/>          
            <Route path='/history' component={History} exact/>
            <Route path='*' component={PageNotFound} exact/>
            </Switch>
            </ScrollToTop>          
        </div>
      );
    } return <div>Loading ...</div>
  }
}

const mapStateToProps = (state) => {
  return {
    cookie : state.user.cookie,
    id : state.user.id
  }
}

export default withRouter(connect(mapStateToProps, {keepLogin,cookieChecked})(App));

