const BASE_URL = process.env.REACT_APP_API || '';

const fetchWithTimeout = (url, options, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

export const checkToken = (token) => {
  return fetchWithTimeout(`${BASE_URL}/users/me`, {
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
  return fetchWithTimeout(`${BASE_URL}/users/me`, {
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
  return fetchWithTimeout(`${BASE_URL}/items`, {
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
  return fetchWithTimeout(`${BASE_URL}/items/${itemId}/likes`, {
    method: 'PUT',
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
  return fetchWithTimeout(`${BASE_URL}/items/${itemId}/likes`, {
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
  return fetchWithTimeout(`${BASE_URL}/items/${itemId}`, {
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
  return fetchWithTimeout(`${BASE_URL}/items`, {
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
