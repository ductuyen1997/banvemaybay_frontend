import {
  takeLatest, all, call, put,
} from 'redux-saga/effects'
import { get } from 'lodash'
import UsersActions, { UsersTypes } from './usersRedux'
import usersAPI from './usersAPI'
import AppActions from '../../redux/appRedux'

export default function* clinicRootSagas() {
  yield all([
    yield takeLatest(UsersTypes.GET_USERS, getUsers),
  ])
}

function* getUsers({ limit, skip }) {
  try {
    const data = yield call(usersAPI.getUsers, limit, skip)
    const clinics = get(data, ['users'], [])
    const total = get(data, ['total'], 0)
    yield put(UsersActions.getUsersSuccess(clinics, total))
  } catch (error) {
    yield put(AppActions.showErrorRequest(error))
    yield put(UsersActions.getUsersFailure(error))
  }
}
