import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getAirportsRequest: ['params', 'resolve', 'reject'],
  getAirportsSuccess: ['airports'],
  getAirportsFailure: ['error'],

  createFlightRequest: ['params', 'resolve', 'reject'],
  createFlightSuccess: ['flight'],
  createFlightFailure: ['error'],

  getFlightsRequest: ['params', 'resolve', 'reject'],
  getFlightsSuccess: ['flights'],
  getFlightsFailure: ['error'],
})

export const FlightTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  airports: [],
  flights: [],
})

/* ------------- Reducers ------------- */

// get airports reducer
const getAirportsRequest = (state) => state.merge({ isGetAiportsRequest: true })
const getAirportsSuccess = (state, { airports }) => state.merge({ isGetAiportsRequest: false, airports })
const getAirportsFailure = (state) => state.merge({ isGetAiportsRequest: false })

// create flight reducer
const createFlightRequest = (state) => state.merge({ isCreateFlightRequest: true })
const createFlightSuccess = (state, { flight }) => {
  const { flights } = state.toJS()
  flights.push(flight)
  return state.merge({ isCreateFlightRequest: false, flights })
}
const createFlightFailure = (state) => state.merge({ isCreateFlightRequest: false })

// get flights reducer
const getFlightsRequest = (state) => state.merge({ isGetFlightsRequest: true })
const getFlightsSuccess = (state, { flights }) => state.merge({ isGetFlightsRequest: false, flights })
const getFlightsFailure = (state) => state.merge({ isGetFlightsRequest: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_AIRPORTS_REQUEST]: getAirportsRequest,
  [Types.GET_AIRPORTS_SUCCESS]: getAirportsSuccess,
  [Types.GET_AIRPORTS_FAILURE]: getAirportsFailure,

  [Types.CREATE_FLIGHT_REQUEST]: createFlightRequest,
  [Types.CREATE_FLIGHT_SUCCESS]: createFlightSuccess,
  [Types.CREATE_FLIGHT_FAILURE]: createFlightFailure,

  [Types.GET_FLIGHTS_REQUEST]: getFlightsRequest,
  [Types.GET_FLIGHTS_SUCCESS]: getFlightsSuccess,
  [Types.GET_FLIGHTS_FAILURE]: getFlightsFailure,
})
