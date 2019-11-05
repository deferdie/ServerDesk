import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DocumentTitle from 'react-document-title';
import Particles from 'react-particles-js';

// Components
import GuestNav from '../components/GuestNav';
import RegistrationForm from './auth/components/RegistrationForm';
import { FeatureList, SeerverDeskCarousel } from './Marketing';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 1200
  }
}));

const Welcome = () => {
  const classes = useStyles();

  return (
    <DocumentTitle title={`Welcome - ${window.App.name}`}>
      <div className="min-h-screen homepage-background">
        <div className={classes.root}>
          <div className={classes.paper}>
            <GuestNav />
            <Particles
              style={{
                position: 'absolute',
                left: 0
              }}
              width="100%"
              params={{
                particles: {
                  line_linked: {
                    shadow: {
                      enable: true,
                      color: '#3CA9D1',
                      blur: 5
                    },
                    move: {
                      radius: 200
                    }
                  }
                }
              }}
            />
            <Grid container spacing={2}>
              <Grid item md={12} lg={12} xl={12} id="particle">
                <h1 className="p-2 text-white homepage-heading text-center">
                  Ready to deploy your app?
                </h1>

                <div>
                  <SeerverDeskCarousel />
                </div>
              </Grid>
            </Grid>
          </div>
        </div>

        <Grid container>
          <FeatureList />
        </Grid>

        <Grid container alignItems="center" alignContent="center">
          <Grid item md={12} lg={12} xl={12}>
            <Paper className="registrationForm">
              <RegistrationForm />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </DocumentTitle>
  );
};

export default Welcome;
