import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';

const tutorialSteps = [
  {
    label: 'San Francisco – Oakland Bay Bridge, United States',
    imgPath: '/images/screenshot/servers.jpg'
  },
  {
    label: 'Bird',
    imgPath: '/images/screenshot/applications.jpg'
  },
  {
    label: 'Bali, Indonesia',
    imgPath: '/images/screenshot/servers.jpg'
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    minWidth: '100%',
    flexGrow: 1
  },
  img: {
    padding: '20px',
    maxHeight: '600px',
    overflow: 'hidden',
    display: 'block',
    width: '600px'
  }
}));

export default function SeerverDeskCarousel () {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  useEffect(() => {
    setTimeout(handleNext, 1500);
  });

  const handleNext = () => {
    if (maxSteps === activeStep + 1) {
      setActiveStep(0);
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  return (
    <div className={classes.root}>
      <img
        className={classes.img}
        src={tutorialSteps[activeStep].imgPath}
        alt={tutorialSteps[activeStep].label}
      />
    </div>
  );
}
