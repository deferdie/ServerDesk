import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

// Components
import Server from '../Servers';
import ServerProvider from '../ServerProviders';
import SourceProvider from '../SourceProviders';
import VerticalStepper from '../../components/VerticalStepper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100% !important'
  }
}));

const formAction = () => {
  console.log('Submit foirm');
};

const SetUp = () => {
  const classes = useStyles();

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
        },
        {
          title: 'Servers',
          content: (
            <Server
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
