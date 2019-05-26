import {
  takeLatest, all, call, put,
} from 'redux-saga/effects'
import AirportActions, { AirportTypes } from '../redux/airportRedux'
import AppActions from '../redux/appRedux'
import airportAPI from '../services/airportAPI'

export default function* airportRootSagas() {
  yield all([
    yield takeLatest(AirportTypes.CREATE_AIRPORT_REQUEST, createAirportRequest),
    yield takeLatest(AirportTypes.AIRPORTS_REQUEST, airportsRequest),
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
