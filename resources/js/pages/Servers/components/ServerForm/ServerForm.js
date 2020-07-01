import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid
} from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';

// Components
import { hasError } from '../.././../../helpers/error';
import VerticalStepper from '../../../../components/VerticalStepper';

// Stepper pages
import ServerDetailsStep from './ServerFormSteps/ServerDetailsStep';
import ServerSoftwareStep from './ServerFormSteps/ServerSoftwareStep';

const ServerForm = (props) => {
  const {
    formAction,
    formErrors,
    serverFormData,
    setServerFormData
  } = props;

  const [serverProviders, setServerProviders] = useState([]);
  const [userServerCreds, setUserServerCreds] = useState([]);
  const [loadingProviderPlan, setLoadingProviderPlan] = useState(false);
  const [serverProviderPlans, setServerProviderPlans] = useState([]);

  useEffect(() => {
    const serverProvidersCopy = [...serverProviders];

    axios.get('/api/user/server-providers').then(data => {
      data.data.data.map((cred) => {
        serverProvidersCopy.push(cred.server_provider);
      });
      setUserServerCreds(data.data.data);
      setServerProviders(serverProvidersCopy);
    });
  }, []);

  const handleChange = event => {
    setServerFormData({
      ...serverFormData,
      [event.target.name]: event.target.value
    });
  };

  /**
   * Get the plans for the provider
   * @param {SyntheticEvent} event The event fired from the change
   */
  const serverChanged = event => {
    let provider = event.target.value;

    if (serverFormData.user_server_provider_credential_id !== '') {
      setLoadingProviderPlan(true);

      axios.get(`/api/server-providers/${provider}/${serverFormData.user_server_provider_credential_id}`).then(data => {
        const providerPlans = { ...serverProviderPlans };
        _.set(providerPlans, provider, data.data);
        setServerProviderPlans(providerPlans);
        setLoadingProviderPlan(false);
      });
    }

    setServerFormData({
      ...serverFormData,
      [event.target.name]: provider
    });
  };

  return (
    <Grid
      container
      spacing={3}
    >
      <VerticalStepper
        onFinish={formAction}
        steps={[
          {
            title: 'Server details',
            content: (
              <ServerDetailsStep
                formErrors={formErrors}
                formData={serverFormData}
                handleChange={handleChange}
                serverChanged={serverChanged}
                serverProviders={serverProviders}
                userServerCreds={userServerCreds}
                loadingProviderPlan={loadingProviderPlan}
                serverProviderPlans={serverProviderPlans}
              />
            ),
            error: () => {
              let fields = [
                'name',
                'user_server_provider_credential_id',
                'server_provider_id'
              ];
              return fields.map((field) => {
                if (hasError(formErrors, field) === true) {
                  return true;
                }
                return false;
              })[0];
            }
          },
          {
            title: 'Server software',
            content: (
              <ServerSoftwareStep
                formErrors={formErrors}
                formData={serverFormData}
                handleChange={handleChange}
              />
            ),
            error: () => {
              let fields = [
                'name',
                'wants_php',
                'wants_node',
                'wants_mysql',
                'php_version',
                'mysql_version'
              ];
              return fields.map((field) => {
                if (hasError(formErrors, field) === true) {
                  return true;
                }
                return false;
              })[0];
            }
          }
        ]}
      />
    </Grid>
  );
};

ServerForm.propTypes = {
  formAction: PropTypes.func,
  formErrors: PropTypes.array,
  serverFormData: PropTypes.object.isRequired,
  setServerFormData: PropTypes.func.isRequired
};

export default ServerForm;
