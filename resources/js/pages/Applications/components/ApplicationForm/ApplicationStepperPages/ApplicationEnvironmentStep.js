import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField
} from '@material-ui/core';

// Components
import { hasError, getError } from '../../../../../helpers/error';

const ApplicationEnvironmentStep = (props) => {
  const {
    formErrors,
    applicationFormData,
    handleChange
  } = props;

  return (
    <React.Fragment>
      {applicationFormData.type === 'Laravel' && (
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            fullWidth
            multiline
            margin="dense"
            rows="10"
            variant="outlined"
            name="env_variables"
            onChange={handleChange}
            defaultValue={applicationFormData.env_variables}
            error={hasError(formErrors, 'env_variables')}
            label="Paste your .env values here. Each value should be on a new line"
            helperText={hasError(formErrors, 'env_variables') ? getError(formErrors, 'env_variables') : 'Add your env variables for your Laravel APP. Each env value should be placed on a new line'}
          />
        </Grid>
      )}
    </React.Fragment>
  );
};

ApplicationEnvironmentStep.propTypes = {
  formErrors: PropTypes.object,
  handleChange: PropTypes.func,
  applicationFormData: PropTypes.object
};

export default ApplicationEnvironmentStep;
