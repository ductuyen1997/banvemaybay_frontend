import {
  all, takeLatest, put, call, select,
} from 'redux-saga/effects'
import { replace } from 'react-router-redux'
import { delay } from 'redux-saga'
import Notifications from 'react-notification-system-redux'
import { setToken } from '../configures/axios'
import AppActions, { AppTypes } from '../redux/appRedux'
import UserActions from '../redux/userRedux'

function* appRootSagas() {
  yield all([
    yield takeLatest(AppTypes.SHOW_SUCCESS_REQUEST, showSuccessRequest),
    yield takeLatest(AppTypes.SHOW_ERROR_REQUEST, showErrorRequest),
    yield takeLatest(AppTypes.STARTUP_WORKING_FLOW, startupWorkingFlow),
  ])
}

/*
  App working flow when firt load
*/
function* startupWorkingFlow({ history }) {
  try {
    const user = yield select(state => state.user.get('user').toJS())
    const isSignin = yield select(state => state.user.get('isSignin'))
    if (isSignin) {
      if (
        history.location.pathname === '/signin'
        || history.location.pathname === '/signup'
      ) {
        yield put(replace('/'))
      }
      setToken(user.token)
      yield put(AppActions.getAppReady(true))
    } else {
      if (
        history.location.pathname !== '/signin'
        && history.location.pathname !== '/signup'
      ) {
        yield put(replace('/signin'))
      }
      setToken('')
      yield put(AppActions.getAppReady(true))
    }
  } catch (error) {
    setToken('')
    yield put(AppActions.getAppReady(true))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* showSuccessRequest({ message }) {
  const notificationOpts = {
    message,
    position: 'tc',
    autoDismiss: 3,
  }
  yield put(Notifications.success(notificationOpts))
}

function* showErrorRequest(action) {
  let { error } = action

  try {
    yield call(delay, 500)
    let message = ''
    if (typeof error === 'string') {
      message = error
    } else {
      if (typeof error.data === 'object') {
        error = error.data
      }

      if (error.message === 'jwt expired') {
        yield put(UserActions.signOut())
        return
      }

      message = error.message || 'Server error'
    }

    const notificationOpts = {
      title: 'Error',
      message,
      position: 'tc',
      autoDismiss: 3,
    }

    yield put(Notifications.error(notificationOpts))
  } catch (e) {
    const notificationOpts = {
      title: 'Error',
      message: 'Server error',
      position: 'tc',
      autoDismiss: 3,
    }

    yield put(Notifications.error(notificationOpts))
  }
}

export default appRootSagas
