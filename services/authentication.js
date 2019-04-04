import jwt from 'jsonwebtoken';

const ERROR_NO_AUTH_HEADER = 'NoAuthHeader';
const ERROR_TOKEN_EXPIRED = 'TokenExpiredError';

export function authenticateLenient(req, res, next) {
  authenticate(req, res).then((response) => {
    req.auth0Id = response.decoded.sub;
    next();
  }).catch((response) => {
    const { error } = response;
    if (error.name === ERROR_NO_AUTH_HEADER) {
      res.status(401).json({ message: 'user not logged in' });
      return;
    } else if (error.name === ERROR_TOKEN_EXPIRED) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token);
      req.auth0Id = decoded.sub;
      next();
      return;
    }

    res.status(401).json({ error, message: 'Access token invalid' });
    return;
  });
}

export function authenticateStrict(req, res, next) {
  authenticate(req, res).then((response) => {
    req.auth0Id = response.decoded.sub;
    next();
  }).catch((response) => {
    const { decoded, error } = response;
    if (error.name === ERROR_NO_AUTH_HEADER) {
      res.status(401).json({ message: 'user not logged in' });
      return;
    } else if (error.name === ERROR_TOKEN_EXPIRED) {
      res.status(401).json({ error, message: 'Access token expired' });
      return;
    }

    res.status(401).json({ error, message: 'Access token invalid' });
    return;
  });
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
