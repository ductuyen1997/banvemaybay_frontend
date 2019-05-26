import querystring from 'querystring'
import { request } from '../../configures/axios'

const getUsers = (limit, skip) => request.get(`users?${querystring.stringify({ limit, skip })}`)


export default { getUsers }
