import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@material-ui/core';

// Components
import { hasError, getError } from '../../../../../../helpers/error';

const MySQLUserForm = (props) => {
  const { setUserFormData, formData, formErrors } = props;

  const handleChange = event => {
    setUserFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
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
        <TextField
          fullWidth
          label="Database user name"
          margin="dense"
          name="name"
          onChange={handleChange}
          required
          value={formData.name}
          variant="outlined"
          helperText={hasError(formErrors, 'name') ? getError(formErrors, 'name') : 'Please specify the name for the user to add to the database'}
          error={hasError(formErrors, 'name')}
        />
      </Grid>

      <Grid
        item
        md={12}
        xs={12}
      >
        <TextField
          fullWidth
          label="Password for the user (This is optional)"
          margin="dense"
          type="password"
          name="password"
          onChange={handleChange}
          required
          value={formData.password}
          variant="outlined"
          helperText={hasError(formErrors, 'password') ? getError(formErrors, 'password') : 'Please specify the password for the user to add to the database'}
          error={hasError(formErrors, 'password')}
        />
      </Grid>
    </Grid>
  );
};

MySQLUserForm.propTypes = {
  formData: PropTypes.object,
  formErrors: PropTypes.array,
  setUserFormData: PropTypes.func
};

export default MySQLUserForm;
