import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import history from 'utils/history'
import { reducer as notifications } from 'react-notification-system-redux'

/*
  - Function create root reducer work with immutable state
  - Pass reducers to param
*/

function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    notifications,
    // eslint-disable-next-line global-require
    language: require('./containers/LanguageProvider/reducer').reducer, // eslint-disable-line,
    user: require('./redux/userRedux').reducer, // eslint-disable-line
    app: require('./redux/appRedux').reducer, // eslint-disable-line
    airport: require('./redux/airportRedux').reducer, // eslint-disable-line
    ...injectedReducers,
  })
  const mergeWithRouterState = connectRouter(history)
  return mergeWithRouterState(rootReducer)
}

export default createReducer
