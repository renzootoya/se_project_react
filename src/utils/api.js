const API_BASE_URL = process.env.REACT_APP_API || '/api';

const fetchWithTimeout = (url, options, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

export const signup = (name, avatar, email, password) => {
  return fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, avatar, email, password })
  }).then(res => res.json()).catch(err => {
    console.error('Signup fetch error:', err);
    return { message: err.message || 'Network error' };
  });
};

export const signin = (email, password) => {
  return fetchWithTimeout(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }).then(res => res.json()).catch(err => {
    console.error('Signin fetch error:', err);
    return { message: err.message || 'Network error' };
  });
};

export const checkToken = (token) => {
  return fetchWithTimeout(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json()).catch(err => {
    console.error('CheckToken error:', err);
    return { message: err.message || 'Network error' };
  });
};

export const updateUser = (token, name, avatar) => {
  return fetchWithTimeout(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, avatar })
  }).then(res => res.json()).catch(err => {
    console.error('UpdateUser error:', err);
    return { message: err.message || 'Network error' };
  });
};

export const getItems = () => {
  return fetchWithTimeout(`${API_BASE_URL}/clothing`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).catch(err => {
    console.error('GetItems error:', err);
    return { data: [], message: err.message || 'Network error' };
  });
};

export const addCardLike = (token, itemId) => {
  return fetchWithTimeout(`${API_BASE_URL}/clothing/${itemId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json()).catch(err => {
    console.error('AddCardLike error:', err);
    return { message: err.message || 'Network error' };
  });
};

export const removeCardLike = (token, itemId) => {
  return fetchWithTimeout(`${API_BASE_URL}/clothing/${itemId}/unlike`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json()).catch(err => {
    console.error('RemoveCardLike error:', err);
    return { message: err.message || 'Network error' };
  });
};

export const deleteItem = (token, itemId) => {
  return fetchWithTimeout(`${API_BASE_URL}/clothing/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json()).catch(err => {
    console.error('DeleteItem error:', err);
    return { message: err.message || 'Network error' };
  });
};

export const createItem = (token, name, imageUrl, weather) => {
  return fetchWithTimeout(`${API_BASE_URL}/clothing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, imageUrl, weather })
  }).then(res => res.json()).catch(err => {
    console.error('CreateItem error:', err);
    return { message: err.message || 'Network error' };
  });
};
