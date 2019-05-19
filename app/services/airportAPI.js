import { request } from '../configures/axios'

const createAirport = params => request.post('airports/', params)

export default { createAirport }
