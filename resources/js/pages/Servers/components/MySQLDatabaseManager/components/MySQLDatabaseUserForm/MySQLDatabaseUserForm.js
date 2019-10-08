import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid
} from '@material-ui/core';
import _ from 'lodash';

// Components
import ListManager from '../../../../../../components/ListManager';
import { hasError, getError } from '../../../../../../helpers/error';

const MySQLDatabaseUserForm = (props) => {
  const { database, users } = props;
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [avaliableUsers, setAvaliableUsers] = useState([]);

  useEffect(() => {
    setSelectedUsers(_.get(database, 'users', []));
    setAvaliableUsers(users);
  }, []);

  const itemAdded = (item, index) => {
    let selected = [...selectedUsers];
    selected.push(item);
    setSelectedUsers(selected);

    let avaliable = [...avaliableUsers];
    avaliable.splice(index, 1);
    setAvaliableUsers(avaliable);
  };

  const itemRemoved = (item, index) => {
    let avaliable = [...avaliableUsers];
    avaliable.push(item);
    setAvaliableUsers(avaliable);

    let selected = [...selectedUsers];
    selected.splice(index, 1);
    setSelectedUsers(selected);
  };

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        md={12}
        xs={12}
      >
        <ListManager
          itemAdded={itemAdded}
          itemRemoved={itemRemoved}
          selectedListLabel="name"
          avaliableListLabel="name"
          avaliableList={avaliableUsers}
          selectedList={selectedUsers}
        />
      </Grid>
    </Grid>
  );
};

MySQLDatabaseUserForm.propTypes = {
  users: PropTypes.array,
  database: PropTypes.object
};

export default MySQLDatabaseUserForm;
