import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #666',
    borderRadius: '3px',
    boxShadow: theme.shadows[5],
    width: '75%'
  },
  modalTitle: {
    padding: theme.spacing(2, 2, 2),
    borderBottom: '1px solid #e4e4e4'
  },
  modalContent: {
    padding: theme.spacing(2, 2, 2)
  }
}));

const TransitionsModal = (props) => {
  const classes = useStyles();
  const { open, onClose, title, children } = props;

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => onClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title" className={classes.modalTitle}>
              {title}
            </h2>
            <div className={classes.modalContent}>
              {children}
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

TransitionsModal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.any,
  open: PropTypes.bool.isRequired
};

export default TransitionsModal;
