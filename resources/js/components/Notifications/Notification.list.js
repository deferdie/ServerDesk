import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from 'lodash';
import axios from 'axios';

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
    notifications,
    setNotifications
  } = props;

  const userScrolled = (event) => {
    const clientTotalScrollHeight = event.target.scrollTop + event.target.clientHeight;

    if (clientTotalScrollHeight >= event.target.scrollHeight) {
      axios.get(notifications.next_page_url).then((data) => {
        let n = {...notifications};

        data.data.data.map((data) => {
          n.data.push(data);
        });

        n.from = data.data.from;
        n.total = data.data.total;
        n.to = data.data.to;
        n.last_page = data.data.last_page;
        n.next_page_url = data.data.next_page_url;
        n.current_page = data.data.current_page;
        console.log(n)
        setNotifications(n);
      });
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
  notifications: PropTypes.object.isRequired,
  setNotifications: PropTypes.func.isRequired
};

export default NotificationList;
