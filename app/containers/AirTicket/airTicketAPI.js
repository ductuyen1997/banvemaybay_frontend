import { request } from '../../configures/axios'

const createAirticket = params => request.post('air-tickets/', params)

const getAirtickets = params => request.get('air-tickets/', { params })

const getCustomers = params => request.get('customers/', { params })

export default {
  createAirticket,
  getAirtickets,
  getCustomers,
}
