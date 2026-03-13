const BASE_URL = process.env.REACT_APP_API || '';

export const signup = (name, avatar, email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, avatar, email, password }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error('Signup error:', err);
      return { message: err.message || 'Network error' };
    });
};

export const signin = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error('Signin error:', err);
      return { message: err.message || 'Network error' };
    });
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error('CheckToken error:', err);
      return { message: err.message || 'Network error' };
    });
};
