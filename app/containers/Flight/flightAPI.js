import { request } from '../../configures/axios'

const getAirports = (params) => (
  request.get('airports/', { params })
)

const createFlight = (params) => (
  request.post('flights/', params)
)

const getFlights = (params) => (
  request.get('flights/', { params })
)

const getFlight = (params) => (
  request.get(`flights/${params.id}`)
)

// Delete flight
const deleteFlight = flightId => request.delete(`flights/${flightId}`)

// Update flight
const updateFlight = (flightId, params) => request.put(`flights/${flightId}`, params)

export default {
  getAirports,
  createFlight,
  getFlights,
  getFlight,
  deleteFlight,
  updateFlight,
}
