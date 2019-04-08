import jwt from 'jsonwebtoken';
import models from 'src/db/models';

const ERROR_NO_AUTH_HEADER = 'NoAuthHeader';
const ERROR_TOKEN_EXPIRED = 'TokenExpiredError';

export function authenticateLenient(req, res, next) {
  authenticate(req, res).then((response) => {
    req.auth0Id = response.decoded.sub;
    return fetchUser({ auth0Id: response.decoded.sub });
  }).then(user => {
    validateUser({ user });
    req.user = user;
    next();
  }).catch((response) => {
    console.log('response', response);
    const { error } = response;
    if (error.name === ERROR_NO_AUTH_HEADER) {
      res.status(401).json({ message: 'Forbidden' });
      return;
    } else if (error.name === ERROR_TOKEN_EXPIRED) {
      handleLenientTokenExpired({ req });
      return;
    }

    res.status(401).json({ error, message: 'Forbidden' });
    return;
  });
}

function handleLenientTokenExpired({ req }) {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token);
  fetchUser({ auth0Id: decoded.sub }).then(user => {
    validateUser({ user });
    req.auth0Id = decoded.sub;
    req.user = user;
    next();
  }).catch(e => {
    res.status(401).json({ error: e, message: 'Forbidden' });
  });
}

export function authenticateStrict(req, res, next) {
  authenticate(req, res).then((response) => {
    req.auth0Id = response.decoded.sub;
    return fetchUser({ auth0Id: response.decoded.sub });
  }).then(user => {
    validateUser({ user });
    req.user = user;
    next();
  }).catch((response) => {
    console.log('ERROR ', response);
    const { decoded, error } = response;
    if (error.name === ERROR_NO_AUTH_HEADER) {
      res.status(401).json({ message: 'Forbidden' });
      return;
    } else if (error.name === ERROR_TOKEN_EXPIRED) {
      res.status(401).json({ error, message: 'Forbidden' });
      return;
    }

    res.status(401).json({ error, message: 'Forbidden' });
    return;
  });
}

function fetchUser({ auth0Id }) {
  return models.user.findOne({ where: { auth0Id }});
}

function validateUser({ user }) {
  if (!user.role.includes('banned')) return;
  throw({ error: { message: 'Forbidden', name: 'bannedUser' } });
}

function authenticate(req, res) {
  return new Promise((resolve, reject) => {
    const { authorization } = req.headers;

    if (!authorization) {
      reject({ error: { message: 'user not logged in', name: ERROR_NO_AUTH_HEADER }});
      return;
    }

    const token = authorization.split(' ')[1];
    const cert = process.env.ACCESS_TOKEN_CERTIFICATE.replace(/\\n/g, '\n');
    jwt.verify(token, cert, { algorithms: ['RS256'] }, (error, decoded) => {
      if (error) reject({ error, decoded });
      else resolve({ error, decoded });
    });
  });
}
