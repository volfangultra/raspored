import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';

const LoaderComponent = ({ message = 'Loading...' }) => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Loader active size="large" inline="centered">
      {message}
    </Loader>
  </div>
);

LoaderComponent.propTypes = {
  message: PropTypes.string,
};

export default LoaderComponent;
