import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';

// Components
import { hasError, getError } from '../.././../../helpers/error';

const UpTimeCheckForm = (props) => {
  const {
    formData,
    formErrors,
    setFormData
  } = props;

  const handleChange = event => {
    setFormData({
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
          label="Name"
          margin="dense"
          name="name"
          onChange={handleChange}
          required
          value={formData.name}
          variant="outlined"
          helperText={hasError(formErrors, 'name') ? getError(formErrors, 'name') : 'Enter a name for your team mate'}
          error={hasError(formErrors, 'name')}
        />
      </Grid>
    </Grid>
  );
};

UpTimeCheckForm.propTypes = {
  formData: PropTypes.object.isRequired,
  formErrors: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired
};

export default UpTimeCheckForm;
