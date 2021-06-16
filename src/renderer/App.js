import React, { Suspense, Fragment } from 'react';
import { VIEW_TOOLBAR, VIEW_SETTINGS, VIEW_SUGGESTION, VIEW_PERMISSION, VIEW_FIND } from 'constants/view-names';

const Toolbar = React.lazy(() => import('./views/Toolbar'));
const Settings = React.lazy(() => import('./views/Settings'));
const Suggestion = React.lazy(() => import('./views/Suggestion'));
const Permission = React.lazy(() => import('./views/Permission'));
const Find = React.lazy(() => import('./views/Find'));

const __DATA__ = window.process.argv.reduce((obj, s) => {
  const [key, value] = s.split('=');

  obj[key] = value;

  return obj;
}, {});

window.__DATA__ = __DATA__;

const App = () => (
  <Suspense fallback={<Fragment />}>
    {__DATA__.viewName === VIEW_TOOLBAR && <Toolbar />}

    {__DATA__.viewName === VIEW_SETTINGS && <Settings />}

    {__DATA__.viewName === VIEW_SUGGESTION && <Suggestion />}

    {__DATA__.viewName === VIEW_PERMISSION && <Permission />}

    {__DATA__.viewName === VIEW_FIND && <Find />}
  </Suspense>
);

export default App;
