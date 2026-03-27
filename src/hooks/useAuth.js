import { useDebugValue } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectCurrentUser,
  selectAccessToken,
  selectIsAuthenticated,
  setCredentials,
  logout,
} from '@/store/slices/authSlice.js';

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useDebugValue(user, (u) => (u ? 'Logged In' : 'Logged Out'));

  return {
    user,
    accessToken,
    isAuthenticated,
    setCredentials: (data) => dispatch(setCredentials(data)),
    logout: () => dispatch(logout()),
  };
};

export default useAuth;