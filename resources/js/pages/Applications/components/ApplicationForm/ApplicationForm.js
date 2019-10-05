import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid
} from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';

// Components
import { hasError } from '../../../../helpers/error';
import ApplicationStepper from './ApplicationStepper';

// Stepper pages
import SelectServerStep from './ApplicationStepperPages/SelectServerStep';
import ApplicationSettingStep from './ApplicationStepperPages/ApplicationSettingStep';
import ApplicationEnvironmentStep from './ApplicationStepperPages/ApplicationEnvironmentStep';

const ApplicationForm = (props) => {
  const {
    formErrors,
    formAction,
    applicationFormData,
    setApplicationFormData
  } = props;

  const [userSourceProviders, setUserSourceProviders] = useState([]);
  const [selectedSourceProvider, setSelectedSourceProvider] = useState(null);

  useEffect(() => {
    axios.get('/api/user/source-providers').then(data => {
      setUserSourceProviders(data.data.data);
    });
  }, []);

  const handleChange = event => {
    setApplicationFormData({
      ...applicationFormData,
      [event.target.name]: event.target.value
    });
  };

  const sourceProviderChanged = event => {
    // Find the provider
    let provider = _.find(userSourceProviders, (o) => { return o.id == event.target.value; });

    if (provider) {
      setSelectedSourceProvider(provider.source_provider.name);
    }

    handleChange(event);
  };

  return (
    <Grid
      container
      spacing={3}
    >
      <ApplicationStepper
        onFinish={formAction}
        steps={[
          {
            title: 'Deployment settings',
            content: (
              <SelectServerStep
                formErrors={formErrors}
                handleChange={handleChange}
                applicationFormData={applicationFormData}
                sourceProviderChanged={sourceProviderChanged}
              />
            ),
            error: () => {
              let fields = ['server_id', 'user_source_provider_id'];
              return fields.map((field) => {
                if (hasError(formErrors, field) === true) {
                  return true;
                }
                return false;
              })[0];
            }
          },
          {
            title: 'Application Settings',
            content: (
              <ApplicationSettingStep
                formErrors={formErrors}
                handleChange={handleChange}
                applicationFormData={applicationFormData}
              />
            ),
            error: () => {
              let fields = ['type', 'domain'];
              return fields.map((field) => {
                if (hasError(formErrors, field) === true) {
                  return true;
                }
                return false;
              })[0];
            }
          },
          {
            title: 'Environment Settings',
            content: (
              <ApplicationEnvironmentStep
                formErrors={formErrors}
                handleChange={handleChange}
                applicationFormData={applicationFormData}
              />
            ),
            error: () => {
              let fields = ['env_variables'];
              return fields.map((field) => {
                if (hasError(formErrors, field) === true) {
                  return true;
                }
                return false;
              })[0];
            }
          }
        ]} />
    </Grid>
  );
};

ApplicationForm.propTypes = {
  formErrors: PropTypes.object,
  formAction: PropTypes.object,
  applicationFormData: PropTypes.object,
  setApplicationFormData: PropTypes.func
};

export default ApplicationForm;
