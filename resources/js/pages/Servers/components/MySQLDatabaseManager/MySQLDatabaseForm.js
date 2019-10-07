import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@material-ui/core';

// Components
import { hasError, getError } from '../../../../helpers/error';

const MySQLDatabaseForm = (props) => {
  const { setServerFormData, formData, formErrors } = props;

  const handleChange = event => {
    setServerFormData({
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
          label="Database name"
          margin="dense"
          name="name"
          onChange={handleChange}
          required
          value={formData.name}
          variant="outlined"
          helperText={hasError(formErrors, 'name') ? getError(formErrors, 'name') : 'Please specify the database name'}
          error={hasError(formErrors, 'name')}
        />
      </Grid>
    </Grid>
  );
};

MySQLDatabaseForm.propTypes = {
  formData: PropTypes.object,
  formErrors: PropTypes.array,
  setServerFormData: PropTypes.func
};

export default MySQLDatabaseForm;
