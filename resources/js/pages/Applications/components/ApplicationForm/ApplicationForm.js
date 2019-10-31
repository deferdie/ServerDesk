import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid
} from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';

// Components
import { hasError } from '../../../../helpers/error';
import VerticalStepper from '../../../../components/VerticalStepper';

// Stepper pages
import SelectServerStep from './ApplicationStepperPages/SelectServerStep';
import WordPressSettingStep from './ApplicationStepperPages/WordPressSettingStep';
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
  const [servers, setServers] = useState([]);

  useEffect(() => {
    axios.get('/api/user/source-providers').then(data => {
      setUserSourceProviders(data.data.data);
    });

    axios.get('/api/servers').then(data => {
      setServers(data.data.data);
    });
  }, []);

  const handleChange = event => {
    setApplicationFormData({
      ...applicationFormData,
      [event.target.name]: event.target.value
    });
  };

  const sourceProviderChanged = event => {
    handleChange(event);
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
            title: 'Deployment settings',
            content: (
              <SelectServerStep
                servers={servers}
                formErrors={formErrors}
                handleChange={handleChange}
                applicationFormData={applicationFormData}
                userSourceProviders={userSourceProviders}
                sourceProviderChanged={sourceProviderChanged}
              />
            ),
            error: () => {
              return [
                'server_id',
                'user_source_provider_id'
              ].map((field) => {
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
              return [
                'type',
                'domain'
              ].map((field) => {
                if (hasError(formErrors, field) === true) {
                  return true;
                }
                return false;
              })[0];
            }
          },
          {
            show: applicationFormData.type !== 'WordPress',
            title: 'Environment Settings',
            content: (
              <ApplicationEnvironmentStep
                formErrors={formErrors}
                handleChange={handleChange}
                applicationFormData={applicationFormData}
              />
            ),
            error: () => {
              return [
                'env_variables'
              ].map((field) => {
                if (hasError(formErrors, field) === true) {
                  return true;
                }
                return false;
              })[0];
            }
          },
          {
            show: applicationFormData.type === 'WordPress',
            title: 'WordPress Settings',
            content: (
              <WordPressSettingStep
                servers={servers}
                formErrors={formErrors}
                handleChange={handleChange}
                applicationFormData={applicationFormData}
              />
            ),
            error: () => {
              return [
                'env_variables'
              ].map((field) => {
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
  formAction: PropTypes.func.isRequired,
  applicationFormData: PropTypes.object,
  setApplicationFormData: PropTypes.func
};

export default ApplicationForm;
