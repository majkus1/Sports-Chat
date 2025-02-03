import React from 'react';

export const UserContext = React.createContext({
  token: null,
  setToken: () => {},
  username: null,
  setUsername: () => {},
  language: null,
  setLanguage: () => {},
});

