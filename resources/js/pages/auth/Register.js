import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import { registerUser, googleSignIn } from '../../actions/auth';
import { destructServerErrors } from '../../helpers/error';
import GoogleSignIn from '../../components/GoogleSignIn';
import RegistrationForm from './components/RegistrationForm';

const propTypes = {
  registerUser: PropTypes.func.isRequired,
  googleSignIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

class Register extends Component {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: ''
    };
  }

  registerSuccess () {
    this.props.history.push('/dashboard');
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.registerUser(this.state)
      .then(response => this.registerSuccess())
      .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }

  handleInputChange (e) {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        ...{ [e.target.name]: '' }
      }
    });
  }

  handleGoogleSignInSuccess (credentials) {
    this.props.googleSignIn(credentials)
      .then(response => this.registerSuccess())
      .catch(error => this.setState({ errors: destructServerErrors(error) })); ;
  }

  render () {
    return (
      <DocumentTitle title={`Register - ${window.App.name}`}>
        <div className="flex justify-center items-center w-full flex-col py-4 min-h-screen bg-grey-lightest">
          <div className="p-4">
            <Link
              to="/"
              className="text-grey-darkest text-bold no-underline text-indigo text-2xl"
            >
                Server Desk
            </Link>
          </div>

          <div className="bg-white border rounded border-grey-light w-3/4 sm:w-1/2 lg:w-2/5 xl:w-1/4 px-8 py-4">

            <RegistrationForm />
          </div>
          <div className="p-4 text-grey-dark text-sm">
            <span>Already have an account? </span>
            <Link to="/signin" className="no-underline text-grey-darker font-bold"> Sign in</Link>
          </div>

          <div className="border rounded bg-white border-grey-light w-3/4 sm:w-1/2 lg:w-2/5 xl:w-1/4 px-8 py-4">
            <GoogleSignIn googleSignInSuccess={(credentials) => this.handleGoogleSignInSuccess(credentials)} />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

Register.propTypes = propTypes;

const mapDispatchToProps = { registerUser, googleSignIn };

export default connect(null, mapDispatchToProps)(withRouter(Register));
