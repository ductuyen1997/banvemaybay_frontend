import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LaddaButton, { EXPAND_LEFT, XL } from 'react-ladda'
import 'ladda/dist/ladda-themeless.min.css'

/* eslint-disable react/prefer-stateless-function */
class LoadingButton extends Component {
  render() {
    const {
      children, loading, onClick, color, className,
    } = this.props
    return (
      <LaddaButton
        className={`btn btn-${color} btn-ladda ${className}`}
        loading={loading}
        onClick={onClick}
        data-size={XL}
        data-style={EXPAND_LEFT}
      >
        {children}
      </LaddaButton>
    )
  }
}
LoadingButton.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  className: PropTypes.string,
}

export default LoadingButton
