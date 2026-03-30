import { useDebugValue } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsHydrating,
  setCredentials,
  logout,
} from '@/store/slices/authSlice.js';

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isHydrating = useSelector(selectIsHydrating);

  useDebugValue(user, (u) => (u ? 'Logged In' : 'Logged Out'));

  return {
    user,
    isAuthenticated,
    isHydrating,
    setCredentials: (data) => dispatch(setCredentials(data)),
    logout: () => dispatch(logout()),
  };
};

export default useAuth;
