import {
  takeLatest, all, call, put,
} from 'redux-saga/effects'
import FlightActions, { FlightTypes } from './flightRedux'
import AppActions from '../../redux/appRedux'
import flightAPI from './flightAPI'

export default function* airportRootSagas() {
  yield all([
    yield takeLatest(FlightTypes.GET_AIRPORTS_REQUEST, getAirportsRequest),
    yield takeLatest(FlightTypes.CREATE_FLIGHT_REQUEST, createFlightRequest),
    yield takeLatest(FlightTypes.GET_FLIGHTS_REQUEST, getFlightsRequest),
    yield takeLatest(FlightTypes.DELETE_FLIGHT_REQUEST, deleteFlightsRequest),
    yield takeLatest(FlightTypes.UPDATE_FLIGHT_REQUEST, updateFlightRequest),
  ])
}

function* getAirportsRequest({ params }) {
  try {
    const { airports } = yield call(flightAPI.getAirports, params)
    yield put(FlightActions.getAirportsSuccess(airports))
  } catch (error) {
    yield put(FlightActions.getAirportsFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* createFlightRequest({ params, resolve }) {
  try {
    const newFlight = yield call(flightAPI.createFlight, params)
    const { flight } = yield call(flightAPI.getFlight, { id: newFlight.flight._id })
    yield put(FlightActions.createFlightSuccess(flight))
    yield put(AppActions.showSuccessRequest(`Create flight successfuly`))
    resolve && resolve()
  } catch (error) {
    yield put(FlightActions.createFlightFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* getFlightsRequest({ params }) {
  try {
    const { flights } = yield call(flightAPI.getFlights, params)
    yield put(FlightActions.getFlightsSuccess(flights))
  } catch (error) {
    yield put(FlightActions.getFlightsFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* deleteFlightsRequest({ flightId, index }) {
  try {
    yield call(flightAPI.deleteFlight, flightId)
    yield put(FlightActions.deleteFlightSuccess(index))
    yield put(AppActions.showSuccessRequest('Delete flight success'))
  } catch (err) {
    yield put(FlightActions.deleteFlightFailure(err))
    yield put(AppActions.showErrorRequest(err))
  }
}

function* updateFlightRequest({ flightId, params, acctionSuccess }) {
  try {
    const { flight } = yield call(flightAPI.updateFlight, flightId, params)
    yield put(FlightActions.updateFlightSuccess(flight))
    yield put(AppActions.showSuccessRequest('Update flight success'))
    if (acctionSuccess) acctionSuccess()
  } catch (err) {
    yield put(FlightActions.updateFlightFailure(err))
    yield put(AppActions.showErrorRequest(err))
  }
}