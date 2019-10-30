import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

// Components
import ServerProvider from '../ServerProviders';
import SourceProvider from '../SourceProviders';
import VerticalStepper from '../../components/VerticalStepper';
import PageLoader from '../../components/PageLoader';
import Axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100% !important'
  }
}));

const SetUp = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [hasSourceProvider, setHasSourceProvider] = useState(false);
  const [hasServerProvider, setHasServerProvider] = useState(false);
  const [activeStepOverride, setActiveStepOverride] = useState(false);

  const formAction = () => {
    setLoading(true);
    // Check if a user has setup a Source provier
    if (hasSourceProvider === false) {
      Axios.get('/api/user/source-providers').then((data) => {
        if (data.data.data.length > 0) {
          setHasSourceProvider(true);
        } else {
          // Set toast warning about this
          setActiveStepOverride(0);
        }
      });
    }

    // Check if a user has setup a server provider
    if (hasServerProvider === false) {
      Axios.get('/api/user/server-providers').then((data) => {
        if (data.data.data.length > 0) {
          setHasServerProvider(true);
        } else {
          // Set toast warning about this
          setLoading(false);
          setActiveStepOverride(1);
        }
      });
    }

    // Set the setup as complete
    Axios.put('/api/user', {
      welcome_completed: true
    }).then((data) => {
      // Fire a happy notification to set as complete
      // Update the user in state and redirect the user to the applications page
    });
  };

  if (loading === true) {
    return (
      <PageLoader
        label="Setting up your account..."
        loading={loading}
      />
    );
  }

  return (
    <VerticalStepper
      style={{width: '100%'}}
      className={classes.root}
      onFinish={formAction}
      activeStepOverride={activeStepOverride}
      steps={[
        {
          title: 'Source Providers',
          content: (
            <SourceProvider />
          ),
          error: () => {}
        },
        {
          title: 'Server Provider',
          content: (
            <ServerProvider
              showList={false}
            />
          ),
          error: () => {}
        }
      ]}
    />
  );
};

const mapStateToProps = ({ auth: { authenticated } }) => ({ authenticated });
export default connect(mapStateToProps)(SetUp);
