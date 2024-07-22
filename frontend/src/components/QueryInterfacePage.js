import React from 'react';
import QueryInput from './QueryInput';
import RecentChats from './RecentChats';
import ResultDisplay from './ResultDisplay';

const QueryInterfacePage = () => {
  return (
    <div>
      <QueryInput />
      <RecentChats />
      <ResultDisplay />
    </div>
  );
};

export default QueryInterfacePage;