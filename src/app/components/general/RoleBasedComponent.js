import React from 'react'

const RoleBasedComponent = ({ condition, user, children }) => {
    if (!condition(user)) return null;
    return <>{children}</>;
  };

export default RoleBasedComponent