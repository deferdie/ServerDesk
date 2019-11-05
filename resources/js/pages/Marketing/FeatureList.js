import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Typography, Divider } from '@material-ui/core';
import DnsIcon from '@material-ui/icons/Dns';
import LockIcon from '@material-ui/icons/Lock';
import AppsIcon from '@material-ui/icons/Apps';
import StorageIcon from '@material-ui/icons/Storage';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ScheduleIcon from '@material-ui/icons/Schedule';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import GroupIcon from '@material-ui/icons/Group';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CodeIcon from '@material-ui/icons/Code';

const styles = theme => ({
  root: {
    width: '100%',
    color: '#fff',
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: '#3b13b0'
  },
  container: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(30),
    display: 'flex',
    position: 'relative'
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    marginBottom: '40px',
    textAlign: 'center'
  },
  title: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180
  },
  featureHeader: {
    marginBottom: '20px'
  }
});

function FeatureList (props) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <img
          src="/images/bak/productCurvyLines.png"
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Grid container>
          <Grid item xs={12} className={classes.featureHeader}>
            <Typography variant="h3" align="center">
              Time saving features
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.featureHeader}>
            <Typography variant="body1" align="center">
              Features build to save you time, money and to allow you to get the best from your <br />
              servers and deliver the best possible online experience for your customers and your applications
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <DnsIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Server Provision
              </Typography>
              <Typography variant="body1">
                {'From the latest trendy boutique hotel to the iconic palace with XXL pool'}
                {', go for a mini-vacation just a few subway stops away from your home.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <LockIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Free SSL
              </Typography>
              <Typography variant="body1">
                {'One click SSL'}
                {'your Sundays will not be alike.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <AppsIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Applications
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <StorageIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                MySQL database manager
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <AccountTreeIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Background processes
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <ScheduleIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                CRON Jobs
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <MergeTypeIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Source providers
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <BlurOnIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Server providers
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <GroupIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Team
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <CheckCircleOutlineIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Uptime checks
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <CheckCircleOutlineIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Nginx Management
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <CodeIcon fontSize="large" />
              <Typography variant="h6" className={classes.title}>
                Backup
              </Typography>
              <Typography variant="body1">
                {'By registering, you will access specially negotiated rates '}
                {'that you will not find anywhere else.'}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

FeatureList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FeatureList);
