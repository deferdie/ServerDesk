import React from 'react';
import store from '../store';
import { Route, Redirect } from 'react-router-dom';
import AppLayoutRoute from './AppLayoutRoute';
import { setIntendedUrl } from '../helpers/auth';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../theme';
import { Main as MainLayout } from '../layouts';

const propTypes = {
  component: PropTypes.func.isRequired,
  rest: PropTypes.object,
  location: PropTypes.object
};

const AuthRoute = ({ component: Component, ...rest }) => (
  <ThemeProvider theme={theme}>
    <MainLayout>
      <Route
        {...rest}
        render={props => {
          const { auth: { authenticated } } = store.getState();

          if (!authenticated) {
            setIntendedUrl(props.location.pathname);
          }

          return authenticated ? (
            <AppLayoutRoute component={Component} {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/signin',
                state: { from: props.location }
              }}
            />
          );
        }
        }
      />
    </MainLayout>
  </ThemeProvider>
);

AuthRoute.propTypes = propTypes;
AuthRoute.displayName = 'Auth Route';

export default AuthRoute;
