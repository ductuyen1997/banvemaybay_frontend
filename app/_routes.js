import React from 'react'
// import { FormattedMessage } from 'react-intl'

// import messages from './containers/DefaultLayout/messages'

const Dashboard = React.lazy(() => import('containers/Dashboard'))
const Airport = React.lazy(() => import('containers/Airport'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/airport', name: 'Airport', component: Airport },
]

export default routes
