import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getUsers: ['limit', 'skip'],
  getUsersSuccess: ['users', 'total'],
  getUsersFailure: ['error'],
})

export const UsersTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  isGettingUsers: false,
  total: 0,
  users: [],
  error: '',
})

/* ------------- Reducers ------------- */

// Handle getting users
const getUsers = state => state.merge({
  isGettingUsers: true,
})

const getUsersSuccess = (state, { users, total }) => state.merge({
  isGettingUsers: false,
  users,
  total,
})

const getUsersFailure = (state, { error }) => state.merge({
  isGettingUsers: false,
  error,
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_USERS]: getUsers,
  [Types.GET_USERS_SUCCESS]: getUsersSuccess,
  [Types.GET_USERS_FAILURE]: getUsersFailure,
})
