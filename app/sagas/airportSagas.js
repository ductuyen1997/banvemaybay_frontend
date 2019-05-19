import {
  takeLatest, all, call, put,
} from 'redux-saga/effects'
import AirportActions, { AirportTypes } from '../redux/airportRedux'
import AppActions from '../redux/appRedux'
import airportAPI from '../services/airportAPI'

export default function* airportRootSagas() {
  yield all([
    yield takeLatest(AirportTypes.CREATE_AIRPORT_REQUEST, createAirportRequest),
  ])
}

function* createAirportRequest({ params }) {
  try {
    yield call(airportAPI.createAirport, params)
    yield put(AirportActions.createAirportSuccess())
    yield put(AppActions.showSuccessRequest(`Create airport successfuly`))
  } catch (error) {
    yield put(AirportActions.createAirportFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}
