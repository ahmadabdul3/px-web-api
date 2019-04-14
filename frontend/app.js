import React, { Component, PureComponent, Fragment } from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import reducer from './redux';

// - redux and react router stuff
import { applyMiddleware, compose, createStore } from 'redux';
import {
  connectRouter, routerMiddleware, ConnectedRouter
} from 'connected-react-router';
import thunk from 'redux-thunk';

import Navigation from 'src/frontend/components/navigation';
import AppBodyContainer from 'src/frontend/containers/app_body_container';
import { Route, Redirect } from 'react-router-dom';
import history from 'src/services/browser_history';
import auth from 'src/services/authorization';
// const auth = new Auth();

const store = createStore(
  connectRouter(history)(reducer), // new root reducer with router state
  {}, // initial state
  compose(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      thunk,
    ),
  ),
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AuthorizationWrapper />
        </ConnectedRouter>
      </Provider>
    );
  }
}

class AuthorizationWrapper extends Component {
  handleAuthentication = (nextState) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
      auth.handleAuthentication();
    }
  }

  componentDidMount() {
    const { pathname } = history.location;
    if (pathname === '/auth-redirect') return;
    auth.login();
  }

  render() {
    const { pathname } = history.location;
    const { isAuthenticated } = auth;

    return (
      <Fragment>
        <Route path='/' component={() => {
          if (isAuthenticated()) return <AppComponent />;
          else if (pathname === '/loading') return null;
          else if (pathname === '/auth-redirect') return null;
          return <Redirect to='/loading' />;
        }} />
        <Route path='/loading' component={() => <LoadingDiv />} />
        <Route path='/auth-redirect' render={(props) => {
          this.handleAuthentication(props);
          return (<LoadingDiv />);
        }}/>
      </Fragment>
    );
  }
}

class LoadingDiv extends PureComponent {
  render() {
    return (
      <div style={{
        marginTop: 30,
        marginBottom: 30,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: 300,
        borderRadius: 5,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        padding: 50,
        background: 'white',
      }}>
        Loading...
      </div>
    );
  }
}

class AppComponent extends PureComponent {
  render() {
    return (
      <div className='app-layout'>
        <Navigation auth={this.props.auth} />
        <Route path='/home' component={() => <AppBodyContainer />} />
      </div>
    );
  }
}

if (typeof window !== 'undefined') {
  ReactDom.render(
    <App />, document.getElementById('entry-point')
  );
}
