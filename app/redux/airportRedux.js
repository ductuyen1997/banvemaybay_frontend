import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createAirportRequest: ['params', 'resolve', 'reject'],
  createAirportSuccess: ['success'],
  createAirportFailure: ['failure'],
})

export const AirportTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({

})

/* ------------- Reducers ------------- */
const createAirportRequest = (state) => state.merge({ isCreateAirportRequest: true })
const createAirportSuccess = (state) => state.merge({ isCreateAirportRequest: true })
const createAirportFailure = (state) => state.merge({ isCreateAirportRequest: true })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_AIRPORT_REQUEST]: createAirportRequest,
  [Types.CREATE_AIRPORT_SUCCESS]: createAirportSuccess,
  [Types.CREATE_AIRPORT_FAILURE]: createAirportFailure,
})
