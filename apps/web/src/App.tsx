// import styles from './app.module.css';

import { Route, Routes } from 'react-router-dom';
import AnalyticsPage from './pages/Home/Analytics';
import HomePage from './pages/Home/Index';
import SettingsPage from './pages/Home/Settings';
import UserPage from './pages/User/Index';
import LoginPage from './pages/User/Login';
import RegisterPage from './pages/User/Register';
import { routes } from './routes';

export function App() {

  return (
    <>
      <Routes>

        <Route path={routes.user.index} element={<UserPage />}>
          <Route path={routes.user.login} element={<LoginPage />} />
          <Route path={routes.user.register} element={<RegisterPage />} />
        </Route>

        <Route path={routes.home} element={<HomePage />}>
          <Route path={routes.analytics} element={<AnalyticsPage />} />
          <Route path={routes.settings} element={<SettingsPage />} />
        </Route>

        {/* add not found page here */}

      </Routes >
    </>
  );

}

export default App;
