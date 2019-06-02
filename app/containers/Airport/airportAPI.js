import { request } from '../../configures/axios'

const createAirport = params => request.post('airports/', params)

const getAirports = params => request.get('airports/', { params })

// Delete airport 
const deleteAirport = airportId => request.delete(`airports/${airportId}`)

// Update airport
const updateAirport = (airportId, params) => request.put(`airports/${airportId}`, params)

export default {
  createAirport,
  getAirports,
  deleteAirport,
  updateAirport,
}
