import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row } from 'reactstrap'
import { Card, Button, Modal, Form, Input, Select } from 'antd'
import { connect } from 'react-redux'
import { get, findIndex } from 'lodash'
import { Helmet } from 'react-helmet'
import ReactTable from 'react-table'
import { compose } from 'redux'
import { injectIntl } from 'react-intl'
import injectReducer from '../../utils/injectReducer'
import injectSaga from '../../utils/injectSaga'
import AppActions from '../../redux/appRedux'

import AirportActions, { reducer } from './airportRedux'
import saga from './airportSagas'
import { CITY_CODES } from '../../utils/constants'

const cityCode = []
const INIT_STATE = {
  visible: false,
  name: '',
  address: '',
  city: '',
  photo: '',
  isUpdate: false,
  airportUpdateId: '',
}


class Airport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...INIT_STATE,
    }
  }

  componentDidMount = () => {
    this.createArrayCityCode()
    this.props.airportsRequest({ limit: 20, skip: 0 })
  }

  createArrayCityCode = () => {
    CITY_CODES.forEach((code, name) => cityCode.push({ name, code }))
  }

  handleOk = () => {
    const { isUpdate, name, address, city, photo, airportUpdateId } = this.state
    const { updateAirportRequest, confirm, createAirportRequest } = this.props
    if (isUpdate) {
      confirm(
        `Are you sure to update airport?`,
        'Once you clicked update can\'t undo',
        'Yes',
        'No',
        () => updateAirportRequest(airportUpdateId,
          { name, address, city, photo },
          this.resetForm(),
        )
      )
      return
    }

    const params = { name, address, city, photo }
    createAirportRequest(
      params,
      () => this.resetForm()
    )
  }

  handleCancel = () => {
    this.resetForm()
  }

  resetForm = () => {
    this.setState({ ...INIT_STATE })
  }

  onClickDeleteAirport = (airport, index) => {
    const { deleteAirportRequest, confirm } = this.props
    confirm(
      `Are you sure to delete ${airport.name} airport?`,
      'Once you clicked delete can\'t undo',
      'Delete',
      'Cancel',
      () => deleteAirportRequest(airport._id, index)
    )
  }

  onClickUpdateAirport = (airport) => {
    this.setState({
      ...airport,
      airportUpdateId: airport._id,
      visible: true,
      isUpdate: true,
    })
  }

  render() {
    const { visible, name, address, photo, city, isUpdate } = this.state
    const { airports } = this.props

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <Row>
        <Helmet>
          <title>Airport</title>
          <meta name="airport" content="Description of Airport" />
        </Helmet>

        <Card
          title="Airport list"
          size="small"
          className="w-100"
          extra={<Button
            icon="plus-circle"
            type="primary"
            size="small"
            className="bg-success"
            onClick={() => this.setState({ visible: true })} >
            Create
          </Button>}
        >
          {
            airports.length > 0 && cityCode.length > 0 && (
              <ReactTable
                data={airports}
                defaultPageSize={8}
                columns={[{
                  Header: 'Name',
                  accessor: 'name',
                }, {
                  Header: 'Address',
                  accessor: 'address',
                }, {
                  id: 'city',
                  Header: 'City',
                  accessor: d => cityCode[findIndex(cityCode, item => +item.code === +d.city)].name,
                }, {
                  Header: 'Actions',
                  accessor: '_id',
                  // eslint-disable-next-line no-unused-vars
                  Cell: row => (
                    <div>
                      <Button
                        type="primary"
                        icon="form"
                        size="small"
                        ghost
                        onClick={() => this.onClickUpdateAirport(row.original)}>Update</Button>
                      <Button
                        className="ml-1"
                        type="danger"
                        icon="delete"
                        size="small"
                        onClick={() => this.onClickDeleteAirport(row.original, row.index)}
                        ghost>Delete</Button>
                    </div>
                  ),
                }]}
              />
            )
          }
        </Card>

        <Modal
          title={isUpdate ? "Update airport" : "Create airport"}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              {isUpdate ? 'Update' : 'Create'}
            </Button>,
          ]}
        >
          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="Airport name"
            required
          >
            <Input
              value={name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            className="mb-0"
            {...formItemLayout}
            label="Address"
            required
          >
            <Input
              value={address}
              onChange={(e) => this.setState({ address: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            className="mb-0"
            {...formItemLayout}
            label="City"
            required
          >
            <Select
              value={city ? parseInt(city) : null}
              showSearch
              style={{ width: 200 }}
              placeholder="Select a city"
              onChange={(e) => this.setState({ city: e })}
            >
              {cityCode.map(city =>
                <Select.Option key={city.code} value={city.code}>
                  {city.name}
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            className="mb-0"
            {...formItemLayout}
            label="Photo link"
            required
          >
            <Input
              value={photo}
              onChange={(e) => this.setState({ photo: e.target.value })}
            />
          </Form.Item>

        </Modal>
      </Row>
    )
  }
}

const withReducer = injectReducer({ key: 'airport', reducer })
const withSaga = injectSaga({ key: 'airport', saga })

const mapStateToProps = (state) => ({
  airports: get(state.airport.toJS(), ['airports']) || [],
})

Airport.propTypes = {
  airport: PropTypes.array,
  createAirportRequest: PropTypes.func,
  airportsRequest: PropTypes.func,
  deleteAirportRequest: PropTypes.func,
  confirm: PropTypes.func,
  updateAirportRequest: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
  createAirportRequest: (params, resolve, reject) =>
    dispatch(AirportActions.createAirportRequest(params, resolve, reject)),
  airportsRequest: (params, resolve, reject) =>
    dispatch(AirportActions.airportsRequest(params, resolve, reject)),
  deleteAirportRequest: (airportId, index) =>
    dispatch(AirportActions.deleteAirportRequest(airportId, index)),
  confirm: (title, content, okText, cancelText, actionSuccess, actionFailure) =>
    dispatch(AppActions.confirm(title, content, okText, cancelText, actionSuccess, actionFailure)),
  updateAirportRequest: (airportId, params) =>
    dispatch(AirportActions.updateAirportRequest(airportId, params)),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withReducer, withSaga, withConnect)(injectIntl(Airport))