import React, { Component } from 'react'
import {
  DropdownMenu, DropdownToggle, Nav, DropdownItem,
} from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import {
  AppHeaderDropdown,
  AppNavbarBrand,
  AppSidebarToggler,
} from '@coreui/react'

import { connect } from 'react-redux'
import messages from './messages'
import UserActions from '../../redux/userRedux'

import logo from '../../images/brand/logo.png'
import sygnet from '../../images/brand/sygnet.png'
import avatar from '../../images/avatars/no_avatar.png'
import vietnam from '../../images/brand/vietnam.png'
import english from '../../images/brand/english.jpg'

import LanguageActions from '../LanguageProvider/reducer'
import { VIETNAMESE_CODE, ENGLISH_CODE } from '../../utils/constants'

const defaultProps = {}

/* eslint-disable react/prefer-stateless-function */
class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { changeLocale, locale, children, signOut, ...attributes } = this.props

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{
            src: logo, width: 150, height: 30, alt: 'CoreUI Logo',
          }}
          minimized={{
            src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo',
          }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown>
            <DropdownToggle nav>
              {locale === VIETNAMESE_CODE ? (
                <img src={vietnam} alt={VIETNAMESE_CODE} style={{ width: '40px', height: '30px' }} />
              )
                : (
                  <img src={english} alt={ENGLISH_CODE} style={{ width: '40px', height: '30px' }} />
                )}
            </DropdownToggle>
            <DropdownMenu right className="dropdown-menu">
              <DropdownItem header tag="div" className="text-center">
                <strong><FormattedMessage {...messages.SupportedLanguages} /></strong>
              </DropdownItem>
              <DropdownItem onClick={() => changeLocale(VIETNAMESE_CODE)}>
                {'Tiếng Việt'}
              </DropdownItem>
              <DropdownItem onClick={() => changeLocale(ENGLISH_CODE)}>
                {'English'}
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
          <AppHeaderDropdown>
            <DropdownToggle nav>
              <img
                src={avatar}
                className="img-avatar"
                alt="admin@bootstrapmaster.com"
              />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto', height: 'auto' }}>
              <DropdownItem header tag="div">
                <strong><FormattedMessage {...messages.Account} /></strong>
              </DropdownItem>
              <DropdownItem onClick={signOut}>
                <FormattedMessage {...messages.Logout} />
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {/* <AppAsideToggler className="d-lg-none" mobile /> */}
      </React.Fragment>
    )
  }
}

DefaultHeader.propTypes = {
  signOut: PropTypes.func,
  children: PropTypes.node,
  logoutRequest: PropTypes.func,
}
DefaultHeader.defaultProps = defaultProps

const mapStateToProps = state => ({
  locale: state.language.get('locale'),
})

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(UserActions.signOut()),
  changeLocale: locale => dispatch(LanguageActions.changeLocale(locale)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DefaultHeader)
