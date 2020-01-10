import React from 'react';
import { Route } from 'react-router-dom';

export default function AppliedRoute(props) {
  const { component: C, appProps, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => <C {...props} {...appProps} />}
    />
  );
}