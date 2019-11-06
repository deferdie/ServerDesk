import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Components
import Modal from '../../components/Modal';
import PageWrapper from '../../components/PageWrapper';
import { destructServerErrors } from '../../helpers/error';
import PageLoader from '../../components/PageLoader/PageLoader';
import {
  TeamForm,
  TeamTable,
  TeamToolbar
} from './components';

const TeamList = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamFormErrors, setTeamFormErrors] = useState([]);
  const defaultFormData = {
    name: '',
    email: ''
  };
  const [teamFormData, setTeamFormData] = useState(defaultFormData);

  useEffect(() => {
    // Fetch all of the servers for the user
    axios.get('/api/teams').then((data) => {
      setTeam(data.data.data);

      setLoading(false);
    });
  }, []);

  const addTeam = () => {
    setFormLoading(true);
    axios.post('/api/teams', teamFormData).then((data) => {
      let t = [...team];
      t.push(data.data.data);
      resetTeamForm();
      setTeam(t);
    }).catch((error) => {
      setFormLoading(false);
      setTeamFormErrors(destructServerErrors(error));
    });
  };

  const resetTeamForm = () => {
    setFormLoading(false);
    setTeamFormErrors([]);
    setShowTeamForm(false);
    setTeamFormData(defaultFormData);
  };

  if (loading) {
    return (
      <PageLoader loading={loading} />
    );
  }

  return (
    <PageWrapper>
      <TeamToolbar
        onAddTeam={() => setShowTeamForm(true)}
      />
      <TeamTable
        teams={team}
      />

      <Modal
        saveButton="Add user"
        open={showTeamForm}
        title="Add a new team member"
        onSave={addTeam}
        onClose={resetTeamForm}
        loading={formLoading}
      >
        <TeamForm
          formData={teamFormData}
          formErrors={teamFormErrors}
          setFormData={setTeamFormData}
        />
      </Modal>
    </PageWrapper>
  );
};

export default TeamList;
