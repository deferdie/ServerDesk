import React from 'react';
import DocumentTitle from 'react-document-title';
import GuestNav from '../components/GuestNav';
import Grid from '@material-ui/core/Grid';
import RegistrationPage from './auth/components/RegistrationForm';

const Welcome = () => {
  return (
    <DocumentTitle title={`Welcome - ${window.App.name}`}>
      <div className="min-h-screen homepage-background">
        <GuestNav />
        <Grid container>
          <Grid item md={6} lg={6} xl={6}>
            <h1 className="p-2 text-white homepage-heading">
              Hello <span>Developer!</span> Are you ready to deploy your app!
            </h1>

            <div>
              <button type="button" className="p-3 text-black bg-white font-bold homepage-heading-signup-button">
                GET STARTED
              </button>
            </div>
          </Grid>
          <Grid item md={6} lg={6} xl={6}>
            <RegistrationPage />
          </Grid>
        </Grid>
      </div>
    </DocumentTitle>
  );
};

export default Welcome;
