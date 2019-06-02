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

export default {
  getAirports,
  createFlight,
  getFlights,
  getFlight,
}
