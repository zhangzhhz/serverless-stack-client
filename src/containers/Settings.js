import React, { useState } from 'react';
import { API } from 'aws-amplify';

export default function Settings(props) {
  const [isLoading, setLoading] = useState(false);

  function billUser(details) {
    return API.post('notes', '/billing', {
      body: details
    })
  }

  return (
    <div className="Settings">
      
    </div>
  );
}