import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'
import { get } from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  flightsRequest: ['params', 'resolve', 'reject'],
  flightsSuccess: ['flights'],
  flightsFailure: ['error'],

  createAirticketRequest: ['params', 'resolve', 'reject'],
  createAirticketSuccess: ['airTickets'],
  createAirticketFailure: ['error'],

  getAirTicketsRequest: ['params', 'resolve', 'reject'],
  getAirTicketsSuccess: ['airTickets'],
  getAirTicketsFailure: ['error'],

  getCustomersRequest: ['params', 'resolve', 'reject'],
  getCustomersSuccess: ['customers'],
  getCustomersFailure: ['error'],

  getFlightRequest: ['params', 'resolve', 'reject'],
  getFlightSuccess: ['flight'],
  getFlightFailure: ['error'],
})

export const AirTicketTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  flights: [],
  airTickets: [],
  customers: [],

  flight: null,
})

/* ------------- Reducers ------------- */

// get flight reducer
const flightsRequest = (state) => state.merge({ isFlightsRequest: true })
const flightsSuccess = (state, { flights }) => state.merge({ isFlightsRequest: false, flights })
const flightsFailure = (state) => state.merge({ isFlightsRequest: false })

// create airticket reducer
const createAirticketRequest = (state) => state.merge({ isCreateAirticketRequest: true })
const createAirticketSuccess = (state, { airTickets }) => {
  const arrAirTickets = get(state.toJS(), ['airTickets'])
  airTickets.forEach(item => {
    arrAirTickets.push(item)
  })
  return state.merge({
    isCreateAirticketRequest: false,
    airTickets: arrAirTickets,
  })
}
const createAirticketFailure = (state) => state.merge({ isCreateAirticketRequest: false })

// get multi airTickets reducer
const getAirTicketsRequest = (state) => state.merge({ isAirTicketsRequest: true })
const getAirTicketsSuccess = (state, { airTickets }) => state.merge({ isAirTicketsRequest: false, airTickets })
const getAirTicketsFailure = (state) => state.merge({ isAirTicketsRequest: false })

// get customers reducer
const getCustomersRequest = (state) => state.merge({ isGetCustomersRequest: true })
const getCustomersSuccess = (state, { customers }) => state.merge({ isGetCustomersRequest: false, customers })
const getCustomersFailure = (state) => state.merge({ isGetCustomersRequest: false })

// get flight reducer
const getFlightRequest = (state) => state.merge({ isGetFlightRequest: true })
const getFlightSuccess = (state, { flight }) => state.merge({ isGetFlightRequest: false, flight })
const getFlightFailure = (state) => state.merge({ isGetFlightRequest: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FLIGHTS_REQUEST]: flightsRequest,
  [Types.FLIGHTS_SUCCESS]: flightsSuccess,
  [Types.FLIGHTS_FAILURE]: flightsFailure,

  [Types.CREATE_AIRTICKET_REQUEST]: createAirticketRequest,
  [Types.CREATE_AIRTICKET_SUCCESS]: createAirticketSuccess,
  [Types.CREATE_AIRTICKET_FAILURE]: createAirticketFailure,

  [Types.GET_AIR_TICKETS_REQUEST]: getAirTicketsRequest,
  [Types.GET_AIR_TICKETS_SUCCESS]: getAirTicketsSuccess,
  [Types.GET_AIR_TICKETS_FAILURE]: getAirTicketsFailure,

  [Types.GET_CUSTOMERS_REQUEST]: getCustomersRequest,
  [Types.GET_CUSTOMERS_SUCCESS]: getCustomersSuccess,
  [Types.GET_CUSTOMERS_FAILURE]: getCustomersFailure,

  [Types.GET_FLIGHT_REQUEST]: getFlightRequest,
  [Types.GET_FLIGHT_SUCCESS]: getFlightSuccess,
  [Types.GET_FLIGHT_FAILURE]: getFlightFailure,
})
