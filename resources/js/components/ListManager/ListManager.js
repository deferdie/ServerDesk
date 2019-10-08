import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import uuid from 'uuid';
import _ from 'lodash';

const useStyles = makeStyles(theme => ({
  demo: {
    backgroundColor: theme.palette.background.paper
  }
}));

const ListManager = (props) => {
  const {
    itemAdded,
    itemRemoved,
    selectedList,
    avaliableList,
    selectedListLabel,
    avaliableListLabel
  } = props;
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6}>
        <Typography variant="h6">
          List of avaliable users to add to the database
        </Typography>
        <div className={classes.demo}>
          <List dense={false}>
            {avaliableList.map((item, index) => {
              return (
                <ListItem key={uuid()}>
                  <ListItemText
                    primary={_.get(item, avaliableListLabel)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="add"
                      onClick={() => itemAdded(item, index)}
                    >
                      <AddIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </div>
      </Grid>
      <Grid item xs={6} md={6}>
        <Typography variant="h6">
          List of avaliable users to add to the database
        </Typography>
        <div className={classes.demo}>
          <List dense={false}>
            {selectedList.map((item, index) => {
              return (
                <ListItem key={uuid()}>
                  <ListItemText
                    primary={_.get(item, selectedListLabel, '')}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="Delete"
                      onClick={() => itemRemoved(item, index)}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </div>
      </Grid>
    </Grid>
  );
};

ListManager.propTypes = {
  itemAdded: PropTypes.func.isRequired,
  itemRemoved: PropTypes.func.isRequired,
  selectedList: PropTypes.array.isRequired,
  avaliableList: PropTypes.array.isRequired,
  selectedListLabel: PropTypes.string.isRequired,
  avaliableListLabel: PropTypes.string.isRequired
};

export default ListManager;
