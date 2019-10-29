import React, { useState } from 'react';
import PropPypes from 'prop-types';
import {
  Button,
  TextField,
  Typography
} from '@material-ui/core';
import _ from 'lodash';
import GetAppIcon from '@material-ui/icons/GetApp';
import Axios from 'axios';

// Components
import Modal from '../../../../components/Modal';

const ServerSoftwareManager = (props) => {
  const [service, setService] = useState({});
  const [installServiceForm, setInstallServiceForm] = useState(false);
  const [formData, setFormData] = useState({
    service_id: '',
    php_version: ''
  });

  const {
    server,
    setServer
  } = props;

  const serviceChanged = (e) => {
    let s = _.get(server, `avaliable_service_installs.${e.target.value}`);
    setService(s);
    setFormData({
      ...formData,
      service_id: e.target.value
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const installService = () => {
    // const s = {...server};

    // s.avaliable_service_installs.splice(index, 1);
    // setServer(s);

    Axios.post(`/api/servers/${server.id}/services/${service.id}`, formData).then((data) => {
      console.log(data);
    });
  };

  return (
    <React.Fragment>
      <Typography
        gutterBottom
        variant="h4"
      >
        Install additional services
      </Typography>
      <Button
        color="secondary"
        onClick={() => setInstallServiceForm(true)}
      >
        Install services
      </Button>

      <Modal
        saveButton="Install service"
        title="Service manager"
        open={installServiceForm}
        onSave={installService}
        onClose={() => setInstallServiceForm(false)}
      >
        <TextField
          fullWidth
          label="What service would you like to install"
          margin="dense"
          name="service_id"
          required
          select
          onChange={serviceChanged}
          SelectProps={{ native: true }}
          value={formData.service_id}
          variant="outlined"
        >
          <option selected>Please select</option>
          {_.get(server, 'avaliable_service_installs', []).map((service, index) => {
            return (
              <option
                key={service.name}
                value={index}
              >
                {service.name}
              </option>
            );
          })}
        </TextField>

        {_.get(service, 'name', []) === 'PHP-FPM' && (
          <TextField
            fullWidth
            label="Select PHP version"
            margin="dense"
            name="php_version"
            required
            select
            onChange={(e) => {
              handleChange({
                target: {
                  value: e.target.value,
                  name: 'php_version'
                }
              });
            }}
            SelectProps={{ native: true }}
            value={formData.php_version}
            variant="outlined"
          >
            <option selected>Please select</option>
            {[
              '7.2'
            ].map((version, index) => {
              return (
                <option
                  key={version}
                  value={version}
                >
                  {version}
                </option>
              );
            })}
          </TextField>
        )}
      </Modal>
    </React.Fragment>
  );
};

ServerSoftwareManager.propTypes = {
  server: PropPypes.object.isRequired,
  setServer: PropPypes.func.isRequired
};

export default ServerSoftwareManager;
