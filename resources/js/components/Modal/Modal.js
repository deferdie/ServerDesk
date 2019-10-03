import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100% !important',
    padding: '40px !important'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #666',
    borderRadius: '3px',
    boxShadow: theme.shadows[5],
    minWidth: '100% !important'
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
  const { open, onClose, title, subTitle, children, className, ...rest } = props;

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
            <Card
              {...rest}
              className={clsx(classes.root, className)}
            >
              <CardHeader
                subheader={subTitle}
                title={title}
              />
              <Divider />
              <CardContent>
                {children}
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                >
                  Save details
                </Button>
              </CardActions>
            </Card>
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
  subTitle: PropTypes.string,
  className: PropTypes.string,
  open: PropTypes.bool.isRequired
};

export default TransitionsModal;
