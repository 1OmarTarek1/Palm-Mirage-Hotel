/* global beforeEach, describe, expect, it, jest */

describe('authSlice persistence', () => {
  const AUTH_STORAGE_KEY = 'authState';

  beforeEach(() => {
    window.localStorage.clear();
    jest.resetModules();
  });

  it('hydrates the user from localStorage on refresh', async () => {
    const persistedUser = {
      _id: 'user-1',
      userName: 'Omar Tarek',
      email: 'cr7omartarek@gmail.com',
    };

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: persistedUser }),
    );

    const { default: reducer } = await import('./authSlice');

    const state = reducer(undefined, { type: '@@INIT' });

    expect(state.user).toEqual(persistedUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isHydrating).toBe(true);
  });

  it('persists the user when credentials are set and clears it on logout', async () => {
    const persistedUser = {
      _id: 'user-2',
      userName: 'Palm Mirage Guest',
      email: 'guest@example.com',
    };

    const authModule = await import('./authSlice');
    const reducer = authModule.default;
    const { setCredentials, logout } = authModule;

    let state = reducer(undefined, setCredentials({ user: persistedUser }));

    expect(state.user).toEqual(persistedUser);
    expect(state.isAuthenticated).toBe(true);
    expect(JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY))).toEqual({
      user: persistedUser,
    });

    state = reducer(state, logout());

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});
