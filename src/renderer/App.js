import React, { Suspense } from 'react';

const Toolbar = React.lazy(() => import('./views/Toolbar'));
const Settings = React.lazy(() => import('./views/Settings'));

const __DATA__ = window.process.argv.reduce((obj, s) => {
  const [key, value] = s.split('=');

  obj[key] = value;

  return obj;
}, {});

window.__DATA__ = __DATA__;

const App = () => (
  <Suspense fallback={<div></div>}>
    {__DATA__.viewName === 'toolbar' && <Toolbar />}

    {__DATA__.viewName === 'settings' && <Settings />}
  </Suspense>
);

export default App;
