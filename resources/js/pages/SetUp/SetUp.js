import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

// Components
import ServerProvider from '../ServerProviders';
import SourceProvider from '../SourceProviders';
import VerticalStepper from '../../components/VerticalStepper';
import PageLoader from '../../components/PageLoader';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100% !important'
  }
}));

const SetUp = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const formAction = () => {
    setLoading(true);
    // Check if a user has setup a Source provier

    // Check if a user has setup a server provider

    // Set the setup as complete
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
