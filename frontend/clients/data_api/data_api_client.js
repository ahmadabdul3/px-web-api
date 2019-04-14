import http from 'src/frontend/services/http';
import auth from 'src/services/authorization';

const dataApiClient = {
  baseUrl: function() {
    // return 'process.env.dataApiBaseUrl';
  },
  getHeaders: function() {
    return {
      authorization: 'Bearer ' + auth.accessToken,
    };
  },
  get: function(url) {
    return http.get(url, this.getHeaders());
  },
  post: function(url, data) {
    return http.post(url, data, this.getHeaders());
  },
  patch: function(url, data) {
    return http.patch(url, data, this.getHeaders());
  },
  put: function(url, data) {
    return http.put(url, data, this.getHeaders());
  },
  delete: function(url, data) {
    return http.delete(url, data, this.getHeaders());
  },
};

export default dataApiClient;
