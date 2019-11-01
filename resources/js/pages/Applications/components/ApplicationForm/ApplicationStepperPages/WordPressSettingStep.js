import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import _ from 'lodash';

// Components
import { hasError, getError } from '../../../../../helpers/error';
import { MySQLDatabaseManager } from '../../../../Servers/components';

const WordPressSettingStep = (props) => {
  const {
    servers,
    formErrors,
    handleChange,
    applicationFormData
  } = props;
  const [server, setServer] = useState({});

  useEffect(() => {
    // Find the selected server
    setServer(_.find(servers, (o) => { return o.id == applicationFormData.server_id; }));
  });

  return (
    <React.Fragment>
      <Typography variant="p">Please select what database and user you want to use</Typography>
      <MySQLDatabaseManager server={server} setServer={setServer} />

      {/* Check if any of the databases have any users */}
      <TextField
        fullWidth
        label="Please select the database you want to install WordPress on"
        margin="dense"
        name="mysql_database_id"
        required
        select
        onChange={handleChange}
        SelectProps={{ native: true }}
        value={applicationFormData.mysql_database_id}
        variant="outlined"
        helperText={hasError(formErrors, 'mysql_database_id') ? getError(formErrors, 'mysql_database_id') : 'Please select the database. Only databases with users will be shown here.'}
        error={hasError(formErrors, 'mysql_database_id')}
      >
        <option selected>Please select</option>
        {
          _.get(server, 'my_s_q_l_database', []) && (
            _.get(server, 'my_s_q_l_database', []).map((mysql) => {
              return (
                _.get(mysql, 'users', []).length > 0 && (
                  <option
                    key={mysql.id}
                    value={mysql.id}
                  >
                    {mysql.name}
                  </option>
                )
              );
            })
          )
        }
      </TextField>
    </React.Fragment>
  );
};

WordPressSettingStep.propTypes = {
  servers: PropTypes.array,
  formErrors: PropTypes.object,
  handleChange: PropTypes.func,
  applicationFormData: PropTypes.object
};

export default WordPressSettingStep;
