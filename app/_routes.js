import React from 'react'
import { FormattedMessage } from 'react-intl'

import messages from './containers/DefaultLayout/messages'

const Dashboard = React.lazy(() => import('containers/Dashboard'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
]

export default routes
