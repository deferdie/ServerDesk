import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import uuid from 'uuid';

// Components
import TabPanel from './Tab.pannel';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

const VerticalTabs = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { tabs } = props;

  const a11yProps = (index) => {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={uuid()}
              label={tab.label}
              {...a11yProps(index)}
            />
          );
        })}
      </Tabs>
      {tabs.map((tab, index) => {
        return (
          <TabPanel
            key={uuid()}
            value={value}
            index={index}
          >
            {tab.content}
          </TabPanel>
        );
      })}
    </div>
  );
};

VerticalTabs.propTypes = {
  tabs: PropTypes.array.isRequired
};

export default VerticalTabs;
