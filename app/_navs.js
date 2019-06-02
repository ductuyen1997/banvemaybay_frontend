import { FormattedMessage } from 'react-intl'
import React from 'react'
import messages from './containers/DefaultLayout/messages'

export default {
  items: [
    {
      name: <FormattedMessage {...messages.Dashboard} />,
      url: '/dashboard',
      icon: 'cui-chart font-lg',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      name: <FormattedMessage {...messages.Airport} />,
      url: '/airport',
      icon: 'cui-chart font-lg',
    },
    {
      name: <FormattedMessage {...messages.Flight} />,
      url: '/flight',
      icon: 'cui-chart font-lg',
    },
  ],
}
