import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  Card,
  Button,
  Divider,
  CardHeader,
  CardContent,
  CardActions
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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
  },
  closeIcon: {
    float: 'right',
    cursor: 'pointer',
    marginTop: '12px',
    marginRight: '12px'
  }
}));

const TransitionsModal = (props) => {
  const classes = useStyles();
  const {
    open,
    title,
    onSave,
    onClose,
    loading,
    subTitle,
    children,
    className,
    saveButton,
    showActionButtons,
    ...rest
  } = props;

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
              <CloseIcon
                onClick={onClose}
                className={clsx(classes.closeIcon, className)}
              />

              <CardHeader
                subheader={subTitle}
                title={title}
              />
              <Divider />
              <CardContent>
                {children}
              </CardContent>
              <Divider />
              {showActionButtons && (
                <CardActions>
                  <Button
                    color="primary"
                    onClick={onSave}
                    disabled={loading}
                    variant="contained"
                  >
                    {loading ? (<ClipLoader
                      sizeUnit={'px'}
                      size={20}
                      color={'#123abc'}
                      loading={loading}
                    />) : saveButton }
                  </Button>
                </CardActions>
              )}
            </Card>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

TransitionsModal.defaultProps = {
  loading: false,
  showActionButtons: true
};

TransitionsModal.propTypes = {
  title: PropTypes.string,
  onSave: PropTypes.func,
  loading: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.any,
  subTitle: PropTypes.string,
  className: PropTypes.string,
  saveButton: PropTypes.string,
  open: PropTypes.bool.isRequired,
  showActionButtons: PropTypes.bool
};

export default TransitionsModal;
