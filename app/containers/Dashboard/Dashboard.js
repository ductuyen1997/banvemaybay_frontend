import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { compose } from 'redux'

import messages from './messages'

// eslint-disable-next-line react/prefer-stateless-function
export class Dashboard extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Dashboard</title>
          <meta name="description" content="Description of Dashboard" />
        </Helmet>
        <FormattedMessage {...messages.header} />
      </div>
    )
  }
}

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  }
}

const withConnect = connect(
  null,
  mapDispatchToProps,
)

export default compose(withConnect)(Dashboard)
