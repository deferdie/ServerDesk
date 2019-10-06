import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Grid,
  Switch,
  TextField,
  FormControlLabel
} from '@material-ui/core';

// Components
import { hasError, getError } from '../.././../../../helpers/error';

const ServerSoftwareStep = (props) => {
  const {
    formData,
    formErrors,
    handleChange
  } = props;

  return (
    <React.Fragment>
      <Grid
        item
        md={12}
        xs={12}
      >
        <FormControlLabel
          value={formData.wants_php}
          control={(
            <Switch
              color="primary"
              onChange={(e) => {
                handleChange({
                  target: {
                    value: e.target.value === 'false',
                    name: 'wants_php'
                  }
                });
              }}
              name="wants_php"
            />
          )}
          label="Install PHP"
          labelPlacement="start"
        />
      </Grid>

      {formData.wants_php && (
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            fullWidth
            label="Select PHP version"
            margin="dense"
            name="php_version"
            onChange={handleChange}
            required
            select
            SelectProps={{ native: true }}
            value={formData.php_version}
            variant="outlined"
            helperText={hasError(formErrors, 'php_version') ? getError(formErrors, 'php_version') : 'Please select your required PHP version'}
            error={hasError(formErrors, 'php_version')}
          >
            <option selected>Please select</option>
            {[
              '7.2'
            ].map(option => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </TextField>
        </Grid>
      )}

      <Grid
        item
        md={12}
        xs={12}
      >
        <FormControlLabel
          value={formData.wants_mysql}
          control={(
            <Switch
              color="primary"
              onChange={(e) => {
                handleChange({
                  target: {
                    value: e.target.value === 'false',
                    name: 'wants_mysql'
                  }
                });
              }}
              name="wants_mysql"
            />
          )}
          label="Install MySQL"
          labelPlacement="start"
        />
      </Grid>

      {formData.wants_mysql && (
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            fullWidth
            label="Select a MySQL version"
            margin="dense"
            name="mysql_version"
            onChange={handleChange}
            required
            select
            SelectProps={{ native: true }}
            value={formData.mysql_version}
            variant="outlined"
            helperText={hasError(formErrors, 'mysql_version') ? getError(formErrors, 'mysql_version') : 'Please select your required MySQL version'}
            error={hasError(formErrors, 'mysql_version')}
          >
            <option selected>Please select</option>
            {[
              '5.7'
            ].map(option => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </TextField>
        </Grid>
      )}
    </React.Fragment>
  );
};

ServerSoftwareStep.propTypes = {
  formData: PropTypes.object,
  formErrors: PropTypes.object,
  handleChange: PropTypes.func
};

export default ServerSoftwareStep;
