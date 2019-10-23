import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';

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
      // setTeam(data.data.data);

      setLoading(false);
    });
  }, []);

  const addTeam = () => {
    console.log('adding team');
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
        onClose={() => setShowTeamForm(false)}
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
