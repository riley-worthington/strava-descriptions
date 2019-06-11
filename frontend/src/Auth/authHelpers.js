import Cookies from 'js-cookie';

export const generateRandomString = length => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Sets and returns a new state parameter
export const setNewStateParam = () => {
  const stateParam = generateRandomString(16);
  sessionStorage.setItem('stateParam', stateParam);
  Cookies.remove('stateParam');
  Cookies.set('stateParam', stateParam);
  return stateParam;
}

// Gets the stored state parameter from browser
export const getStoredStateParam = () => {
  return sessionStorage.getItem('stateParam') || Cookies.get('stateParam');
}

// Removes the stored state parameter from browser
export const removeStoredStateParam = () => {
  sessionStorage.removeItem('stateParam');
  Cookies.remove('stateParam');
  return;
}
