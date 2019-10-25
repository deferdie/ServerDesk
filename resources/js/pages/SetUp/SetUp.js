import React from 'react';
import { connect } from 'react-redux';

const SetUp = (props) => {
  return (
    <p>Lets set things up</p>
  );
};

const mapStateToProps = ({ auth: { authenticated } }) => ({ authenticated });
export default connect(mapStateToProps)(SetUp);
