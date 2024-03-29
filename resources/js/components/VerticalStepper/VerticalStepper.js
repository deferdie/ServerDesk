import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}));

const VerticalStepper = (props) => {
  const {
    steps,
    style,
    onFinish,
    activeStepOverride
  } = props;

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);

    if (activeStep + 1 === stepperLength()) {
      onFinish();

      if (activeStepOverride) {
        setActiveStep(1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const stepperHasError = () => {
    let hasError = false;
    steps.map((page) => {
      if (page.error() === true) {
        hasError = true;
      }
    });

    return hasError;
  };

  const lastStep = () => {
    return activeStep === stepperLength() - 1;
  };

  const stepperLength = () => {
    let length = 0;

    steps.map((step) => {
      if (_.get(step, 'show', true) === true) {
        length = length + 1;
      }
    });

    return length;
  };

  return (
    <div className={classes.root} style={style}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((page, index) => (
          _.get(page, 'show', true) && (
            <Step key={index}>
              <StepLabel error={page.error()}>{page.title}</StepLabel>
              <StepContent>
                <Typography>{page.content}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {lastStep() ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          )
        ))}
      </Stepper>
      {activeStep === stepperLength() && (
        <Paper square elevation={0} className={classes.resetContainer}>
          {stepperHasError() ? (
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.button}
            >
              Back
            </Button>
          ) : (
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.button}
            >
              Back
            </Button>
          )}
        </Paper>
      )}
    </div>
  );
};

VerticalStepper.defaultProps = {
  style: {},
  activeStepOverride: false
};

VerticalStepper.propTypes = {
  style: PropTypes.object,
  onFinish: PropTypes.func,
  activeStepOverride: PropTypes.any,
  steps: PropTypes.array.isRequired
};

export default VerticalStepper;
