import React from 'react';
import Footer from '../../components/Footer';

import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.element.isRequired
};

const AppLayout = ({ children, ...rest }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
};

AppLayout.propTypes = propTypes;

export default AppLayout;
