import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import { connect } from 'react-redux';
import { setLoading } from '../actions/loading';
import { initAuthFromExistingToken } from '../actions/auth';
import GuestRoute from './GuestRoute';

// Pages
import NotFound from '../pages/404';
import PropTypes from 'prop-types';
import Welcome from '../pages/Welcome';
import Servers from '../pages/Servers';
import Profile from '../pages/Profile';
import SignIn from '../pages/auth/SignIn';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/auth/Register';
import Applications from '../pages/Applications';
import ServerEdit from '../pages/Servers/server.edit';
import SourceProviders from '../pages/SourceProviders';
import ServerProviders from '../pages/ServerProviders';
import ResetPassword from '../pages/auth/ResetPassword';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ApplicationEdit from '../pages/Applications/applications.edit';

const propTypes = {
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  initAuthFromExistingToken: PropTypes.func.isRequired
};

class App extends Component {
  componentDidMount () {
    this.props.initAuthFromExistingToken(() => this.props.setLoading(false));
  }

  render () {
    if (this.props.loading) {
      return (
        <div className="p-2">loading...</div>
      );
    }

    return (
      <Router>
        <Switch>
          {/* Guest routes */}
          <GuestRoute exact path="/" component={Welcome} />
          <GuestRoute path="/register" component={Register} />
          <GuestRoute path="/signin" component={SignIn} />
          <GuestRoute path="/forgot-password" component={ForgotPassword} />
          <GuestRoute path="/password/reset/:token" component={ResetPassword} />

          {/* Auth routes */}
          <AuthRoute path="/dashboard" component={Dashboard} />
          <AuthRoute path="/applications/:application" component={ApplicationEdit} />
          <AuthRoute path="/applications" component={Applications} />
          <AuthRoute path="/server-providers" component={ServerProviders} />
          <AuthRoute path="/servers/:server" component={ServerEdit} {...this.props} />
          <AuthRoute path="/servers" component={Servers} />
          <AuthRoute path="/source-providers/:provider" component={SourceProviders} />
          <AuthRoute path="/source-providers" component={SourceProviders} />
          <AuthRoute path="/profile/:id" component={Profile} />

          {/* Error routes */}
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

App.propTypes = propTypes;

const mapDispatchToProps = {
  setLoading,
  initAuthFromExistingToken
};

const mapStateToProps = ({ loading }) => ({ loading });

export default connect(mapStateToProps, mapDispatchToProps)(App);
