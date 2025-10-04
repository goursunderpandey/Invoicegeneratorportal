import React  from 'react';
import { Route,Routes } from 'react-router-dom';

const Loader = (loading) => {
 console.log(loading,"loaddd");
  return (
    <div>
    {loading.loading && (
      <div id="global-loader">
        <div className="whirly-loader"></div>
      </div>
    )}
      <Routes>
        <Route path="/"/>
      </Routes>
  </div>
  );
};

export default Loader;
