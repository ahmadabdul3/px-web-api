import auth0 from 'auth0-js';
import history from 'src/services/browser_history';

class Auth {
  accessToken;
  idToken;
  expiresAt;
  auth0 = new auth0.WebAuth({
    audience: 'https://data-api.politixentral.com',
    domain: 'politixentral.auth0.com',
    clientID: 'rTI55EvbmYoA3QNBhpgvEefVy4Q7pUFE',
    redirectUri: 'https://px-staging.herokuapp.com/auth-redirect',
    // redirectUri: 'http://localhost:3000/auth-redirect',
    responseType: 'token id_token',
    scope: 'openid',
    prompt: 'none',
  });

  login = () => {
    this.auth0.authorize();
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        history.replace('/loading');
        // console.log(err);
        // console.error(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken = () => {
    return this.accessToken;
  }

  getIdToken = () => {
    return this.idToken;
  }

  setSession = (authResult) => {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('PX_LOGGED_IN', 'true');
    // console.log('authResult.accessToken', authResult.accessToken);

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // navigate to the home route
    history.replace('/home');
  }

  renewSession = () => {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         // console.log(err);
         // alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  logout = () => {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('PX_LOGGED_IN');

    this.auth0.logout({
      return_to: window.location.origin
    });

    // navigate to the home route
    history.replace('/home');
  }

  isAuthenticated = () => {
    return this.expiresAt && new Date().getTime() < this.expiresAt;
  }
}

const authSingleton = new Auth();
export default authSingleton;
