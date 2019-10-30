import React from 'react';
import store from '../store';
import { Route, Redirect } from 'react-router-dom';
import AppLayoutRoute from './AppLayoutRoute';
import { setIntendedUrl } from '../helpers/auth';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../theme';
import { Main as MainLayout } from '../layouts';
import _ from 'lodash';

const propTypes = {
  rest: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  component: PropTypes.func.isRequired
};

const AuthRoute = ({ component: Component, match, ...rest }) => (
  <ThemeProvider theme={theme}>
    <MainLayout>
      <Route
        {...rest}
        render={props => {
          const { auth: { authenticated, user } } = store.getState();

          if (!authenticated) {
            setIntendedUrl(props.location.pathname);
          }

          // Send the user to the setup page if they have not completed it
          if (_.get(user, 'is_admin', 0) === 1 && _.get(user, 'welcome_completed', 0) === 0) {
            if (props.location.pathname !== '/setup') {
              const provider = _.get(props, 'match.params.provider', '');
              props.history.push(`/setup${props.location.search}&source_provider=${provider}`);
            }
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
