import { request } from '../configures/axios'

const signIn = params => request.post('auth/login-cms', params)

export default { signIn }
