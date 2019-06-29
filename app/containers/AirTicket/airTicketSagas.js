import {
  takeLatest, all, call, put,
} from 'redux-saga/effects'
import AirTicketActions, { AirTicketTypes } from './airTicketRedux'
import AppActions from '../../redux/appRedux'
import flightAPI from '../Flight/flightAPI'
import airTicketAPI from './airTicketAPI'

export default function* airTicketRootSagas() {
  yield all([
    yield takeLatest(AirTicketTypes.FLIGHTS_REQUEST, flightsRequest),
    yield takeLatest(AirTicketTypes.CREATE_AIRTICKET_REQUEST, createAirticketRequest),
    yield takeLatest(AirTicketTypes.GET_AIR_TICKETS_REQUEST, getAirTicketsRequest),
    yield takeLatest(AirTicketTypes.GET_CUSTOMERS_REQUEST, getCustomersRequest),
    yield takeLatest(AirTicketTypes.GET_FLIGHT_REQUEST, getFlightRequest),
  ])
}

function* flightsRequest({ params }) {
  try {
    const { flights } = yield call(flightAPI.getFlights, params)
    yield put(AirTicketActions.flightsSuccess(flights))
  } catch (error) {
    yield put(AirTicketActions.flightsFailure(error))
  }
}

function* createAirticketRequest({ params, resolve }) {
  try {
    const { airTickets } = yield call(airTicketAPI.createAirticket, params)
    yield put(AirTicketActions.getCustomersRequest())
    yield put(AirTicketActions.createAirticketSuccess(airTickets))
    yield put(AppActions.showSuccessRequest(`Create airticket successfuly`))
    resolve && resolve()
  } catch (error) {
    yield put(AirTicketActions.createAirticketFailure(error))
  }
}

function* getAirTicketsRequest({ params }) {
  try {
    const { airTickets } = yield call(airTicketAPI.getAirtickets, params)
    yield put(AirTicketActions.getAirTicketsSuccess(airTickets))
  } catch (error) {
    yield put(AirTicketActions.getAirTicketsFailure(error))
  }
}

function* getCustomersRequest({ params }) {
  try {
    const { customers } = yield call(airTicketAPI.getCustomers, params)
    yield put(AirTicketActions.getCustomersSuccess(customers))
  } catch (error) {
    yield put(AirTicketActions.getCustomersFailure(error))
  }
}

function* getFlightRequest({ params }) {
  try {
    const { flight } = yield call(flightAPI.getFlight, params)
    yield put(AirTicketActions.getFlightSuccess(flight))
  } catch (error) {
    yield put(AirTicketActions.getFlightFailure(error))
  }
}
