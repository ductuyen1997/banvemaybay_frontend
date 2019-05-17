import React, { Component } from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  children: PropTypes.node,
}

const defaultProps = {}

/* eslint-disable react/prefer-stateless-function */
class DefaultFooter extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span>
          <a href="/">Air Tickets</a>
          {' '}
          &copy; 2018.
        </span>
        <span className="ml-auto">
          Powered by
          {' '}
          <a href="/">Thanh Sang</a>
        </span>
      </React.Fragment>
    )
  }
}

DefaultFooter.propTypes = propTypes
DefaultFooter.defaultProps = defaultProps

export default DefaultFooter
