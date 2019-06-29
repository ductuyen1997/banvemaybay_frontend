/*
 * DefaultLayout Messages
 *
 * This contains all the text for the DefaultLayout container.
 */

import { defineMessages } from 'react-intl'

export const scope = 'app.containers.DefaultLayout'

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the DefaultLayout container!',
  },
  Dashboard: {
    id: `${scope}.Dashboard`,
    defaultMessage: 'Dashboard',
  },
  SupportedLanguages: {
    id: `${scope}.SupportedLanguages`,
    defaultMessage: 'Supported Languages',
  },
  Account: {
    id: `${scope}.Account`,
    defaultMessage: 'Account',
  },
  Logout: {
    id: `${scope}.Logout`,
    defaultMessage: 'Logout',
  },
  Airport: {
    id: `${scope}.Airport`,
    defaultMessage: 'Airport',
  },
  Flight: {
    id: `${scope}.Flight`,
    defaultMessage: 'Flight',
  },
  AirTicket: {
    id: `${scope}.AirTicket`,
    defaultMessage: 'AirTicket',
  },
})
