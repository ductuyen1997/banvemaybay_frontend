import {
  takeLatest, all, call, put,
} from 'redux-saga/effects'
import AirportActions, { AirportTypes } from './airportRedux'
import AppActions from '../../redux/appRedux'
import airportAPI from './airportAPI'

export default function* airportRootSagas() {
  yield all([
    yield takeLatest(AirportTypes.CREATE_AIRPORT_REQUEST, createAirportRequest),
    yield takeLatest(AirportTypes.AIRPORTS_REQUEST, airportsRequest),
    yield takeLatest(AirportTypes.DELETE_AIRPORT_REQUEST, deleteAirportRequest),
    yield takeLatest(AirportTypes.UPDATE_AIRPORT_REQUEST, updateAirportRequest),
  ])
}

function* createAirportRequest({ params, resolve }) {
  try {
    const { airport } = yield call(airportAPI.createAirport, params)
    yield put(AirportActions.createAirportSuccess(airport))
    yield put(AppActions.showSuccessRequest(`Create airport successfuly`))
    resolve && resolve()
  } catch (error) {
    yield put(AirportActions.createAirportFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* airportsRequest({ params }) {
  try {
    const { airports } = yield call(airportAPI.getAirports, params)
    yield put(AirportActions.airportsSuccess(airports))
  } catch (error) {
    yield put(AirportActions.airportsFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* deleteAirportRequest({ airportId, index }) {
  try {
    yield call(airportAPI.deleteAirport, airportId)
    yield put(AirportActions.deleteAirportSuccess(index))
    yield put(AppActions.showSuccessRequest('Delete airport success'))
  } catch (err) {
    yield put(AirportActions.deleteAirportFailure(err))
    yield put(AppActions.showErrorRequest(err))
  }
}

function* updateAirportRequest({ airportId, params, acctionSuccess }) {
  try {
    const { airport } = yield call(airportAPI.updateAirport, airportId, params)
    yield put(AirportActions.updateAirportSuccess(airport))
    yield put(AppActions.showSuccessRequest('Update airport success'))
    if (acctionSuccess) acctionSuccess()
  } catch (err) {
    yield put(AirportActions.updateAirportFailure(err))
    yield put(AppActions.showErrorRequest(err))
  }
}