import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createAirportRequest: ['params', 'resolve', 'reject'],
  createAirportSuccess: ['airport'],
  createAirportFailure: ['failure'],

  airportsRequest: ['params', 'resolve', 'reject'],
  airportsSuccess: ['airports'],
  airportsFailure: ['failure'],
})

export const AirportTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  airports: [],
})

/* ------------- Reducers ------------- */


/**
 * @reducer create airport 
 */
const createAirportRequest = (state) => state.merge({ isCreateAirportRequest: true })
const createAirportSuccess = (state, { airport }) => {
  const { airports } = state.toJS()
  airports.push(airport)
  return state.merge({ isCreateAirportRequest: true, airports })
}
const createAirportFailure = (state) => state.merge({ isCreateAirportRequest: true })

/**
 * @reducer get airports
 */
const airportsRequest = (state) => state.merge({ isAirportsRequest: true })
const airportsSuccess = (state, { airports }) => state.merge({ isAirportsRequest: true, airports })
const airportsFailure = (state) => state.merge({ isAirportsRequest: true })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_AIRPORT_REQUEST]: createAirportRequest,
  [Types.CREATE_AIRPORT_SUCCESS]: createAirportSuccess,
  [Types.CREATE_AIRPORT_FAILURE]: createAirportFailure,

  [Types.AIRPORTS_REQUEST]: airportsRequest,
  [Types.AIRPORTS_SUCCESS]: airportsSuccess,
  [Types.AIRPORTS_FAILURE]: airportsFailure,
})
