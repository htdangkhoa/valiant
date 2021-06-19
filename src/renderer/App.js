import React, { Suspense, Fragment } from 'react';
import {
  VIEW_TOOLBAR,
  VIEW_SETTINGS,
  VIEW_SUGGESTION,
  VIEW_PERMISSION,
  VIEW_FIND,
  VIEW_TAB_PREVIEW,
  VIEW_DOWNLOAD_MANAGER,
} from 'constants/view-names';

const Toolbar = React.lazy(() => import('./views/Toolbar'));
const Settings = React.lazy(() => import('./views/Settings'));
const Suggestion = React.lazy(() => import('./views/Suggestion'));
const Permission = React.lazy(() => import('./views/Permission'));
const Find = React.lazy(() => import('./views/Find'));
const TabPreview = React.lazy(() => import('./views/TabPreview'));
const DownloadManager = React.lazy(() => import('./views/DownloadManager'));

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

    {__DATA__.viewName === VIEW_TAB_PREVIEW && <TabPreview />}

    {__DATA__.viewName === VIEW_DOWNLOAD_MANAGER && <DownloadManager />}
  </Suspense>
);

export default App;
