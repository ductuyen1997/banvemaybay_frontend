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