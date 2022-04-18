import { Suspense, lazy, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Player } from '@lottiefiles/react-lottie-player';
import animationData from 'lotties/check-okey-done.json';

import { FetchCurrentUser } from 'services/FetchCurrentUser';

import PublicRoute from 'components/PublicRoute';
import PrivateRoute from 'components/PrivateRoute';

import Modal from 'components/Modal';
import ModalLogout from 'components/ModalLogout';
import ModalAddTransaction from 'components/ModalAddTransaction';
import { selectIsModalLogoutOpen, selectIsModalAddTransactionOpen } from 'redux/selectors';

import Spinner from 'components/Spinner';
import Loader from 'components/Loader';
import InternalServerErrorPage from 'pages/InternalServerErrorPage';

const DashboardPage = lazy(() =>
  import('pages/DashboardPage' /* webpackChunkName: "dashboard-page" */),
);
const LoginPage = lazy(() => import('pages/LoginPage' /* webpackChunkName: "login-page" */));
const RegisterPage = lazy(() =>
  import('pages/RegisterPage' /* webpackChunkName: "register-page" */),
);
const NotFoundPage = lazy(() =>
  import('pages/NotFoundPage' /* webpackChunkName: "notfound-page" */),
);

function App() {
  const isFetching = FetchCurrentUser();
  const [lottieRun, setLottieRun] = useState(false);

  const showModalAddTransaction = useSelector(selectIsModalAddTransactionOpen);
  const showModalLogout = useSelector(selectIsModalLogoutOpen);

  useEffect(() => {
    if (!lottieRun) return;
    const animation = setTimeout(() => setLottieRun(false), 3000);

    return () => clearTimeout(animation);
  }, [lottieRun]);

  return (
    <>
      {lottieRun && (
        <Player
          id='addTransaction'
          autoplay
          loop='false'
          src={animationData}
          animationSpeed={1.5}
          style={{
            height: '120px',
            width: '120px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {!isFetching ? (
        <>
          <Suspense
            fallback={
              <div style={{ paddingTop: 'calc((100vh - 70px) / 2)' }}>
                <Spinner size={70} color='blue' />
              </div>
            }
          >
            <Routes>
              <Route
                path='/home/*'
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path='/register'
                element={
                  <PublicRoute restricted>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path='/login'
                element={
                  <PublicRoute restricted>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route path='/' element={<Navigate to='/home' />} />
              <Route path='/server-error' element={<InternalServerErrorPage />} />
              <Route path='/*' element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          {showModalLogout && <Modal children={<ModalLogout />} />}
          {showModalAddTransaction && (
            <Modal children={<ModalAddTransaction setLottieRun={setLottieRun} />} />
          )}
          <ToastContainer autoClose={3000} theme='colored' limit={1} />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default App;
