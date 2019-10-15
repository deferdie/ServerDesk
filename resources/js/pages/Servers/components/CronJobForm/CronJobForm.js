import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Divider
} from '@material-ui/core';
import _ from 'lodash';
import CronParser from 'cron-parser';

// Components
import { hasError, getError } from '../../../../helpers/error';

const CronJobForm = (props) => {
  const { formData, setFormData, formErrors } = props;

  const crons = [
    {
      'name': 'Every minute',
      'cron': '* * * * *'
    },
    {
      'name': 'Every half hour',
      'cron': '30 * * * *'
    },
    {
      'name': 'Every hour',
      'cron': '0 * * * *'
    },
    {
      'name': 'Every night',
      'cron': '0 0 * * *'
    },
    {
      'name': 'Every week',
      'cron': '0 0 * * 0'
    },
    {
      'name': 'Every month',
      'cron': '0 0 1 * *'
    },
    {
      'name': 'Custom',
      'cron': 'custom'
    }
  ];

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  return (
    <React.Fragment>
      <TextField
        fullWidth
        margin="dense"
        label="Name"
        variant="outlined"
        onChange={handleChange}
        name="name"
        defaultValue={_.get(formData, 'name', '')}
        error={hasError(formErrors, 'name')}
        helperText={hasError(formErrors, 'name') ? getError(formErrors, 'name') : 'Please provide a name for this private key'}
      />

      <TextField
        fullWidth
        margin="dense"
        label="Command"
        variant="outlined"
        onChange={handleChange}
        name="command"
        defaultValue={_.get(formData, 'command', '')}
        error={hasError(formErrors, 'command')}
        helperText={hasError(formErrors, 'command') ? getError(formErrors, 'command') : 'The command that should run'}
      />

      <TextField
        fullWidth
        margin="dense"
        label="User"
        variant="outlined"
        onChange={handleChange}
        name="user"
        defaultValue={_.get(formData, 'user', '')}
        error={hasError(formErrors, 'user')}
        helperText={hasError(formErrors, 'user') ? getError(formErrors, 'user') : 'The user the command should run under'}
      />

      <TextField
        onChange={(e) => {
          setFormData({
            ...formData,
            cron: crons[e.target.value].cron,
            recurrence: crons[e.target.value].name
          });
        }}
        fullWidth
        label="Job occurrence"
        margin="dense"
        name="recurrence"
        required
        select
        SelectProps={{ native: true }}
        variant="outlined"
        helperText={hasError(formErrors, 'recurrence') ? getError(formErrors, 'recurrence') : 'How often should this job run'}
        error={hasError(formErrors, 'recurrence')}
      >
        <option selected>Please select</option>
        {crons.map((option, index) => {
          return (
            <option
              key={option.name}
              value={index}
            >
              {option.name}
            </option>
          );
        })}
      </TextField>

      {formData.recurrence === 'Custom' && (
        <TextField
          fullWidth
          margin="dense"
          label="Your custom cron expression"
          variant="outlined"
          onChange={handleChange}
          name="cron"
          defaultValue={_.get(formData, 'cron', '')}
          error={hasError(formErrors, 'cron')}
          helperText={hasError(formErrors, 'cron') ? getError(formErrors, 'cron') : 'The expression for the crontab'}
        />
      )}

      <br />
      <Divider />
      <div>
        <p>The next time this job will run</p>
        <p>
          {
            CronParser.parseExpression(
              _.get('formData', 'recurrence', '') !== 'Custom' ? _.get('formData', 'recurrence', '') : _.get('formData', 'cron', '')
            ).next().toString()
          }
        </p>
      </div>
    </React.Fragment>
  );
};

CronJobForm.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  formErrors: PropTypes.object
};

export default CronJobForm;
