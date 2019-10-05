import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';
import axios from 'axios';

// Components
import { hasError, getError } from '../../../../../helpers/error';

const SelectSourceProviderStep = (props) => {
  const {
    formErrors,
    applicationFormData,
    sourceProviderChanged
  } = props;

  const [userSourceProviders, setUserSourceProviders] = useState([]);

  useEffect(() => {
    axios.get('/api/user/source-providers').then(data => {
      setUserSourceProviders(data.data.data);
    });
  }, []);

  return (
    <Grid
      item
      md={12}
      xs={12}
    >
      <Grid
        item
        md={12}
        xs={12}
      >
        <TextField
          fullWidth
          label="Where would you like to deply from?"
          margin="dense"
          name="user_source_provider_id"
          onChange={sourceProviderChanged}
          required
          select
          SelectProps={{ native: true }}
          value={applicationFormData.user_source_provider_id}
          variant="outlined"
          helperText={hasError(formErrors, 'user_source_provider_id') ? getError(formErrors, 'user_source_provider_id') : 'Please select your server provider'}
          error={hasError(formErrors, 'user_source_provider_id')}
        >
          <option selected>Please select</option>
          {userSourceProviders.map(option => (
            <option
              key={option.id}
              value={option.id}
            >
              {option.source_provider.name}
            </option>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default SelectSourceProviderStep;
