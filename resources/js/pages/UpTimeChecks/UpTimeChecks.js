import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Components
import Modal from '../../components/Modal';
import PageWrapper from '../../components/PageWrapper';
import { destructServerErrors } from '../../helpers/error';
import PageLoader from '../../components/PageLoader/PageLoader';
import {
  UpTimeCheckForm,
  UpTimeCheckTable,
  UpTimeCheckToolbar
} from './components';

const UpTimeChecks = () => {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showCheckForm, setShowCheckForm] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const defaultFormData = {
    name: '',
    email: ''
  };
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    // Fetch all of the servers for the user
    axios.get('/api/uptime').then((data) => {
      setChecks(data.data.data);

      setLoading(false);
    });
  }, []);

  const addCheck = () => {
    setFormLoading(true);
    axios.post('/api/uptime', formData).then((data) => {
      let t = [...checks];
      t.push(data.data.data);
      resetCheckForm();
      setChecks(t);
    }).catch((error) => {
      setFormLoading(false);
      setFormErrors(destructServerErrors(error));
    });
  };

  const resetCheckForm = () => {
    setFormLoading(false);
    setFormErrors([]);
    setShowCheckForm(false);
    setFormData(defaultFormData);
  };

  if (loading) {
    return (
      <PageLoader loading={loading} />
    );
  }

  return (
    <PageWrapper>
      <UpTimeCheckToolbar
        onAddCheck={() => setShowCheckForm(true)}
      />
      <UpTimeCheckTable
        checks={checks}
      />

      <Modal
        saveButton="Add user"
        open={showCheckForm}
        title="Add a new team member"
        onSave={addCheck}
        onClose={resetCheckForm}
        loading={formLoading}
      >
        <UpTimeCheckForm
          formData={formData}
          formErrors={formErrors}
          setFormData={setFormData}
        />
      </Modal>
    </PageWrapper>
  );
};

export default UpTimeChecks;
