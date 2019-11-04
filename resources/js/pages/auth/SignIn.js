import React, { Component, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { signInUser, googleSignIn } from '../../actions/auth';
import { getIntendedUrl } from '../../helpers/auth';
import { destructServerErrors, hasError, getError } from '../../helpers/error';
import GoogleSignIn from '../../components/GoogleSignIn';

const propTypes = {
  signInUser: PropTypes.func.isRequired,
  googleSignIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const SignIn = (props) => {
  const {
    history,
    signInUser,
    googleSignIn
  } = props;

  const [authDetails, setAuthDetails] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const signInSuccess = () => {
    getIntendedUrl().then(url => history.push(url));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    signInUser(authDetails)
      .then(response => signInSuccess())
      .catch(error => setErrors(destructServerErrors(error)));
  }

  const handleInputChange = (e) => {
    setAuthDetails({
      ...authDetails,
      [event.target.name]: event.target.value
    });
    setErrors(...errors, {
      [e.target.name]: ''
    });
  }

  const handleGoogleSignInSuccess = (credentials) => {
    googleSignIn(credentials)
      .then(response => signInSuccess())
      .catch(error => setErrors(destructServerErrors(error))); ;
  }

  return (
    <DocumentTitle title={`Sign in - ${window.App.name}`}>
      <div className="flex justify-center items-center w-full py-4 flex-col min-h-screen sign-in-gradient">
        <div className="p-4">
          <Link
            to="/"
            className="text-grey-darkest text-bold no-underline text-indigo text-2xl"
          >
            <img src="/logo.png" style={{height: '100px'}} />
          </Link>
        </div>

        <div className="border rounded bg-white border-grey-light w-3/4 sm:w-1/2 lg:w-2/5 xl:w-1/4 px-8 py-4">
          <form onSubmit={e => handleSubmit(e)}
            method="POST">
            <h2 className="text-center mt-4 mb-6 text-grey-darkest">Sign in to ServerDesk</h2>
            <div className="mb-4">
              <label className="block text-grey-darkest text-sm font-bold mb-2" htmlFor="email">
                Email address
              </label>
              <input
                value={authDetails.email}
                onChange={handleInputChange}
                id="email"
                type="email"
                name="email"
                className={`appearance-none border rounded w-full py-2 px-3 text-grey-darker ${hasError(errors, 'email') ? 'border-red' : ''}`}
                placeholder="jane@example.com"
                required
                autoFocus
              />

              {hasError(errors, 'email') &&
                <p className="text-red text-xs pt-2">{getError(errors, 'email')}</p>
              }

            </div>

            <div className="mb-6">
              <label className="block text-grey-darkest text-sm font-bold mb-2" htmlFor="password"> Password </label>
              <input
                value={authDetails.password}
                onChange={handleInputChange}
                type="password"
                id="password"
                name="password"
                className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                required />

            </div>

            <div className="mb-2">
              <button type="submit"
                className="border rounded-full p-3 text-white bg-indigo w-full font-bold hover:bg-indigo-dark">Sign in</button>
            </div>
          </form>

        </div>

        <div className="p-4 text-grey-dark text-sm flex flex-col items-center text-white">
          <div>
            <span>Create a New Account? </span>
            <Link to="/register" className="no-underline font-bold">Register</Link>
          </div>

          <div className="mt-2">
            <strong>Help:</strong> <Link to="/forgot-password" className="no-underline text-xs">Reset Password</Link>
          </div>
        </div>

        <div className="border rounded bg-white border-grey-light w-3/4 sm:w-1/2 lg:w-2/5 xl:w-1/4 px-8 py-4">
          <GoogleSignIn googleSignInSuccess={(credentials) => handleGoogleSignInSuccess(credentials)} />
        </div>
      </div>
    </DocumentTitle>
  );
}

SignIn.propTypes = propTypes;

const mapDispatchToProps = {
  signInUser,
  googleSignIn
};

export default connect(null, mapDispatchToProps)(withRouter(SignIn));
