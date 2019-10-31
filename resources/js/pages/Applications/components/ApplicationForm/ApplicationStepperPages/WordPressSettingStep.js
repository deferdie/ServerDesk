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
    applicationFormData,
  } = props;
  const [server, setServer] = useState({});

  useEffect(() => {
    // Find the selected server
    setServer(_.find(servers, (o) => { return o.id == applicationFormData.server_id; }));
  });

  return (
    <React.Fragment>
      <Typography variant="p">Please select what database and user you want to use</Typography>
      <MySQLDatabaseManager server={server} />
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
