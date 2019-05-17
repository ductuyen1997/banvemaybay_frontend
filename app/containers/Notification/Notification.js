import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Notifications from 'react-notification-system-redux'
import { connect } from 'react-redux'

// eslint-disable-next-line react/prefer-stateless-function
class Notification extends Component {
  render() {
    const { notifications } = this.props
    return <Notifications notifications={notifications} />
  }
}

Notification.propTypes = {
  notifications: PropTypes.array,
}

const mapStateToProps = state => ({
  notifications: state.notifications,
})

export default connect(mapStateToProps)(Notification)
