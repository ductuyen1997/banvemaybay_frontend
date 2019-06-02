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

  deleteAirportRequest: ['airportId', 'index'],
  deleteAirportSuccess: ['index'],
  deleteAirportFailure: ['error'],

  updateAirportRequest: ['airportId', 'params', 'acctionSuccess'],
  updateAirportSuccess: ['airport'],
  updateAirportFailure: ['error'],
})

export const AirportTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  airports: [],
  isDeletingAirport: false,
  isUpdatingAirport: false,
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

// Delete airport
const deleteAirportRequest = state =>
  state.merge({ isDeletingAirport: true })

const deleteAirportSuccess = (state, { index }) => {
  const { airports } = state.toJS()
  airports.splice(index, 1)
  return state.merge({
    isDeletingAirport: false,
    airports,
  })
}

const deleteAirportFailure = (state, { error }) =>
  state.merge({ isDeletingAirport: false, error })

// Update airport
const updateAirportRequest = state =>
  state.merge({ isUpdatingAirport: true })

const updateAirportSuccess = (state, { airport }) => {
  const { airports } = state.toJS()

  const indexAirport = airports.findIndex(item => item._id === airport._id)
  if (indexAirport >= 0) {
    airports[indexAirport] = airport
  } else {
    airports.push(airport)
  }

  return state.merge({
    isUpdatingAirport: false,
    airports,
  })
}

const updateAirportFailure = (state, { error }) =>
  state.merge({
    isUpdatingAirport: false,
    error,
  })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_AIRPORT_REQUEST]: createAirportRequest,
  [Types.CREATE_AIRPORT_SUCCESS]: createAirportSuccess,
  [Types.CREATE_AIRPORT_FAILURE]: createAirportFailure,

  [Types.AIRPORTS_REQUEST]: airportsRequest,
  [Types.AIRPORTS_SUCCESS]: airportsSuccess,
  [Types.AIRPORTS_FAILURE]: airportsFailure,

  [Types.DELETE_AIRPORT_REQUEST]: deleteAirportRequest,
  [Types.DELETE_AIRPORT_SUCCESS]: deleteAirportSuccess,
  [Types.DELETE_AIRPORT_FAILURE]: deleteAirportFailure,

  [Types.UPDATE_AIRPORT_REQUEST]: updateAirportRequest,
  [Types.UPDATE_AIRPORT_SUCCESS]: updateAirportSuccess,
  [Types.UPDATE_AIRPORT_FAILURE]: updateAirportFailure,
})
