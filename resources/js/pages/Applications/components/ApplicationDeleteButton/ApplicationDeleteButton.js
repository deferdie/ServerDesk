import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import SweetAlert from 'sweetalert-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';

// Components
import Button from '../../../../components/Button';

const ApplicationDeleteButton = (props) => {
  const { application, history } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteApplication = () => {
    setShowDeleteModal(false);
    axios.delete(`/api/applications/${application.id}`).then((data) => {
      history.push('/applications');
    });
  };

  return (
    <React.Fragment>
      <Button
        onClick={() => setShowDeleteModal(true)}
        color="secondary"
      >
        Delete Application
      </Button>

      {/* Alert to delete an application */}
      <SweetAlert
        type="error"
        show={showDeleteModal}
        showCancelButton
        title="You are about to delete an application!!"
        text={`Are you sure you want to application : ${_.get(application, 'domain')}`}
        onConfirm={deleteApplication}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
      />
    </React.Fragment>
  );
};

ApplicationDeleteButton.propTypes = {
  history: PropTypes.object,
  application: PropTypes.object
};

export default withRouter(ApplicationDeleteButton);
