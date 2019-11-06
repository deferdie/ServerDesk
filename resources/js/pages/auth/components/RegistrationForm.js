import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import { registerUser, googleSignIn } from '../../../actions/auth';
import { destructServerErrors, hasError, getError } from '../../../helpers/error';

const RegistrationForm = (props) => {
  const {
    history,
    className,
    registerUser
  } = props;

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState('');

  const handleInputChange = (e) => {
    setUserDetails({...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const registerSuccess = () => {
    history.push('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(userDetails)
      .then(response => registerSuccess())
      .catch(error => setErrors(destructServerErrors(error)));
  };

  return (
    <form onSubmit={handleSubmit} method="POST" className={className}>
      <h2 className="text-center mt-4 mb-6 text-grey-darker">
        Sign-up for your free 5 day trial
      </h2>
      <div className="mb-5">
        <label className="block text-grey-darkest text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          value={userDetails.name}
          onChange={handleInputChange}
          type="text"
          id="username"
          name="name"
          className="appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight"
          placeholder="jane doe"
          required
        />

        {hasError(errors, 'name') &&
          <p className="text-red text-xs pt-2">{getError(errors, 'name')}</p>
        }
      </div>

      <div className="mb-5">
        <label className="block text-grey-darkest text-sm font-bold mb-2" htmlFor="email">
          Email address
        </label>
        <input
          value={userDetails.email}
          onChange={handleInputChange}
          id="email"
          name="email"
          type="email"
          className={`appearance-none border rounded w-full py-2 px-3 text-grey-darker  ${hasError(errors, 'name') ? 'border-red' : ''}`}
          placeholder="jane@example.com"
          required />

        {hasError(errors, 'email') &&
          <p className="text-red text-xs pt-2">{getError(errors, 'email')}</p>
        }
      </div>

      <div className="mb-5">
        <label className="block text-grey-darkest text-sm font-bold mb-2" htmlFor="password"> Password </label>
        <input
          value={userDetails.password}
          onChange={handleInputChange}
          type="password"
          id="password"
          name="password"
          className={`appearance-none border rounded w-full py-2 px-3 text-grey-darker  ${hasError(errors, 'password') ? 'border-red' : ''}`}
          minLength={6}
          required />

        {hasError(errors, 'password') &&
          <p className="text-red text-xs pt-2">{getError(errors, 'password')}</p>
        }
      </div>

      <div className="mb-5">
        <label className="block text-grey-darkest text-sm font-bold mb-2" htmlFor="password-confirmation"> Password confirmation </label>
        <input
          value={userDetails.password_confirmation}
          onChange={handleInputChange}
          type="password"
          id="password-confirmation"
          name="password_confirmation"
          className={`appearance-none border rounded w-full py-2 px-3 text-grey-darker  ${hasError(errors, 'password') ? 'border-red' : ''}`}
          required />
      </div>

      <div className="mb-2">
        <button className="border rounded-full p-3 text-white bg-indigo w-full font-bold hover:bg-indigo-dark">Register</button>
      </div>
    </form>
  );
};

RegistrationForm.propTypes = {
  className: PropTypes.string,
  registerUser: PropTypes.func.isRequired,
  googleSignIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const mapDispatchToProps = { registerUser, googleSignIn };

export default connect(null, mapDispatchToProps)(withRouter(RegistrationForm));
