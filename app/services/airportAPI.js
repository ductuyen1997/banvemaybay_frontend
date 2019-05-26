import { request } from '../configures/axios'

const createAirport = params => request.post('airports/', params)

const getAirports = params => request.get('airports/', { params })

export default {
  createAirport,
  getAirports,
}
