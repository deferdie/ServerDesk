import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from 'lodash';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxHeight: '400px',
    overflow: 'scroll',
    overflowX: 'hidden'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

const NotificationList = (props) => {
  const classes = useStyles();
  const {
    notifications
  } = props;

  const userScrolled = (event) => {
    const clientTotalScrollHeight = event.target.scrollTop + event.target.clientHeight;

    if (clientTotalScrollHeight >= event.target.scrollHeight) {
      // Load the next set of data
    }
  };

  return (
    <div className={classes.root} onScroll={userScrolled}>
      {_.get(notifications, 'data', []).map((notification) => {
        return (
          <ExpansionPanel key={notification.id}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                {notification.data.title}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                {notification.data.body}
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      })}
    </div>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.object.isRequired
};

export default NotificationList;
