import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import ReactTable from 'react-table'
import { compose } from 'redux'
import get from 'lodash/get'
import {
  Card, CardHeader, Badge,
} from 'reactstrap'
import { FormattedMessage } from 'react-intl'

import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import messages from './messages'
import avatar from '../../images/avatars/no_avatar.png'
import saga from './usersSagas'
import UsersActions, { reducer } from './usersRedux'

class Clinic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      limit: 10,
    }
    this.fetchData = this.fetchData.bind(this)
  }

  fetchData(state) {
    const { pageSize, page } = state
    const { getUsers } = this.props
    getUsers(pageSize, page * pageSize)
  }

  getLevelColor = (level) => {
    switch (level) {
      case 'diamond':
        return (
          <Badge color="success">
            {level}
          </Badge>
        )
      case 'gold':
        return (
          <Badge color="warning">
            {level}
          </Badge>
        )
      case 'titan':
        return (
          <Badge color="primary">
            {level}
          </Badge>
        )
      default:
        return (
          <Badge color="light">
            {level}
          </Badge>
        )
    }
  }

  renderAvatar = (row) => {
    const avatarUrl = get(row, ['original', 'avatar']) || avatar

    return (
      <img
        src={avatarUrl}
        alt="avatar"
        style={{ width: '50px', height: '50px' }}
        className="img-avatar"
      ></img>
    )
  }

  render() {
    const { total, users, isGettingUsers } = this.props
    const { limit } = this.state
    const columns = [
      {
        Header: () => <strong><FormattedMessage {...messages.UsernameUsers} /></strong>,
        accessor: 'username',
      },
      {
        Header: () => <strong><FormattedMessage {...messages.AvatarUsers} /></strong>,
        accessor: 'avatar',
        Cell: row => (this.renderAvatar(row)),
      },
      {
        Header: () => <strong><FormattedMessage {...messages.PhoneUsers} /></strong>,
        accessor: 'phone',
      },
      {
        Header: () => <strong><FormattedMessage {...messages.RoleUsers} /></strong>,
        accessor: 'role',
      },
      {
        Header: () => <strong><FormattedMessage {...messages.LevelUsers} /></strong>,
        accessor: 'level',
        Cell: row => (
          this.getLevelColor(get(row, ['original', 'level']))
        ),
      },
    ]

    return (
      <div>
        <Helmet>
          <title>Customers List</title>
          <meta name="description" content="Description of Users" />
        </Helmet>
        <Card>
          <CardHeader className="flex flex--stretch">
            <h5><FormattedMessage {...messages.TitleUsers} /></h5>
          </CardHeader>
          <ReactTable
            data={users}
            columns={columns}
            showPageSizeOptions
            showPaginationBottom
            sortable={false}
            defaultPageSize={limit}
            loading={isGettingUsers}
            manual
            className="-highlight"
            pages={Math.ceil(total / limit)}
            onFetchData={this.fetchData}
            onPageSizeChange={pageSize => this.setState({ limit: pageSize })}
          />
        </Card>
      </div>
    )
  }
}

Clinic.propTypes = {
  getUsers: PropTypes.func,
  users: PropTypes.array,
  total: PropTypes.number,
  isGettingUsers: PropTypes.bool,
}

const mapStateToProps = state => ({
  users: state.users.get('users').toJS(),
  total: state.users.get('total'),
  isGettingUsers: state.users.get('isGettingUsers'),
})

const mapDispatchToProps = dispatch => ({
  getUsers: (limit, skip) => dispatch(UsersActions.getUsers(limit, skip)),
})

const withReducer = injectReducer({ key: 'users', reducer })
const withSaga = injectSaga({ key: 'users', saga })

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Clinic)
