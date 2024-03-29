import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import _ from 'lodash';

// Components
import {
  ServerProfile,
  ServerSSHKeys,
  ServerCronJobs,
  MySQLDatabaseManager,
  ServerServiceManager,
  ServerProcessManager
} from './components';
import Tabs from '../../components/Tabs';
import PageLoader from '../../components/PageLoader/PageLoader';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ServerEdit = (props) => {
  const { match, auth } = props;
  const classes = useStyles();
  const { addToast } = useToasts();
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/servers/${match.params.server}`).then((data) => {
      setServer(data.data.data);
      auth.echo.private(`server.${match.params.server}`)
        .listen('ServerUpdated', data => {
          addToast(data.message, { appearance: 'success', autoDismiss: true });
          setServer(data.server);
        });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <PageLoader loading={loading} />
    );
  }

  return (
    <div className={classes.root}>
      {server && (
        <div className={classes.content}>
          <ServerProfile server={server} />
          <Tabs
            tabs={[
              {
                label: 'Database',
                content: (
                  <MySQLDatabaseManager server={server} databases={_.get(server, 'my_s_q_l_database', [])} />
                )
              },
              {
                label: 'Background Processes',
                content: (
                  <ServerProcessManager server={server} setServer={setServer} />
                )
              },
              {
                label: 'SSK keys',
                content: (
                  <ServerSSHKeys server={server} setServer={setServer} />
                )
              },
              {
                label: 'Services',
                content: (
                  <ServerServiceManager
                    server={server}
                    setServer={setServer}
                  />
                )
              },
              {
                label: 'CRON jobs',
                content: (
                  <ServerCronJobs
                    server={server}
                    setServer={setServer}
                  />
                )
              }
            ]}
          />
        </div>
      )}
    </div>
  );
};

ServerEdit.propTypes = {
  auth: PropTypes.object,
  match: PropTypes.object
};

const mapStateToProps = ({ auth, echo }) => ({ auth, echo });

export default connect(mapStateToProps, null, null)(ServerEdit);
