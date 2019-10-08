import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid
} from '@material-ui/core';

// Components
import ListManager from '../../../../../../components/ListManager';
import { hasError, getError } from '../../../../../../helpers/error';

const MySQLDatabaseUserForm = (props) => {
  const { database, users } = props;

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
        <ListManager />
      </Grid>
    </Grid>
  );
};

MySQLDatabaseUserForm.propTypes = {
  users: PropTypes.array,
  database: PropTypes.array
};

export default MySQLDatabaseUserForm;
