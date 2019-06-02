import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row } from 'reactstrap'
import { Card, Button, Modal, Form, Select, DatePicker, InputNumber } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { Helmet } from 'react-helmet'
import ReactTable from 'react-table'
import { compose } from 'redux'
import { injectIntl } from 'react-intl'

import injectReducer from '../../utils/injectReducer'
import injectSaga from '../../utils/injectSaga'
import AppActions from '../../redux/appRedux'
import FlightActions, { reducer } from './flightRedux'
import saga from './flightSagas'

const { Option } = Select
const INIT_STATE = {
  visible: false,
  fromAirportId: '',
  toAirportId: '',
  flightTime: null,
  times: null,
  numSeats: 0,
}

class Flight extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...INIT_STATE,
    }
  }

  componentDidMount = () => {
    const { getAirportsRequest, getFlightsRequest } = this.props
    const params = { limit: 0, skip: 0 }
    getAirportsRequest(params)
    getFlightsRequest(params)
  }

  handleOk = () => {
    const {
      fromAirportId,
      toAirportId,
      flightTime,
      times,
      numSeats,
    } = this.state
    const { confirm, createFlightRequest } = this.props
    confirm(
      `Are you sure to create flight?`,
      'discriptions',
      'Create',
      'Cancel',
      () => {
        const params = { fromAirportId, toAirportId, flightTime, times, numSeats }
        createFlightRequest(params, () => this.resetForm())
      }
    )
  }

  handleCancel = () => {
    this.resetForm()
  }

  resetForm = () => {
    this.setState({ ...INIT_STATE })
  }

  renderCity = (item, index) => (
    <Select.Option key={index}>
      {item.city}
    </Select.Option>
  )

  // Click delete airport 
  // onClickDeleteAirport(airport, index) {
  //   const { deleteAirportRequest, confirm } = this.props
  //   confirm(
  //     `Are you sure to delete ${airport.name} airport?`,
  //     'Once you clicked delete can\'t undo',
  //     'Delete',
  //     'Cancel',
  //     () => deleteAirportRequest(airport._id, index)
  //   )
  // }

  // Click update airport 
  // onClickUpdateAirport(airport) {
  //   this.setState({
  //     ...airport,
  //     airportUpdateId: airport._id,
  //     visible: true,
  //     isUpdate: true,
  //   })
  // }

  renderSelectAirports = (airport) => (
    <Option
      key={airport._id}
      value={airport._id}>
      {airport.name}
    </Option>
  )

  render() {
    const { visible } = this.state
    const { airports, flights } = this.props

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
          title="Flights list"
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
            flights.length > 0 && (
              <ReactTable
                data={flights}
                defaultPageSize={8}
                columns={[{
                  id: 'from',
                  Header: 'Airport from',
                  accessor: d => d.fromAirport.name,
                }, {
                  id: 'to',
                  Header: 'Airport to',
                  accessor: d => d.toAirport.name,
                }, {
                  id: 'flight-time',
                  Header: 'Flight time',
                  accessor: d => moment(d.flightTime).format('DD/MM/YYYY - HH:mm'),
                }, {
                  id: 'times',
                  Header: 'Times',
                  accessor: d => `${d.times} hours`,
                }, {
                  id: 'numseats',
                  Header: 'Number seats',
                  accessor: d => `${d.numSeats} seats`,
                },
                  // {
                  //   Header: 'Actions',
                  //   accessor: '_id',
                  //   // eslint-disable-next-line no-unused-vars
                  //   Cell: row => (
                  //     <div>
                  //       <Button
                  //         type="primary"
                  //         icon="form"
                  //         size="small"
                  //         ghost
                  //         onClick={() => this.onClickUpdateAirport(row.original)}>Update</Button>
                  //       <Button
                  //         className="ml-1"
                  //         type="danger"
                  //         icon="delete"
                  //         size="small"
                  //         onClick={() => this.onClickDeleteAirport(row.original, row.index)}
                  //         ghost>Delete</Button>
                  //     </div>
                  //   ),
                  // },
                ]}
              />
            )
          }
        </Card>

        <Modal
          title="Create Flight"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Create
            </Button>,
          ]}
        >
          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="From"
            required
          >
            <Select
              showSearch
              style={{ width: 300 }}
              onChange={(e) => this.setState({ fromAirportId: e })}
            >
              {airports.length > 0 && airports.map(this.renderSelectAirports)}
            </Select>
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="To"
            required
          >
            <Select
              showSearch
              style={{ width: 300 }}
              onChange={(e) => this.setState({ toAirportId: e })}
            >
              {airports.length > 0 && airports.map(this.renderSelectAirports)}
            </Select>
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="Flight time"
            required
          >
            <DatePicker
              showTime
              onChange={(e) => this.setState({ flightTime: moment(e).toDate() })}
              onOk={(e) => this.setState({ flightTime: moment(e).toDate() })}
            />
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="Time"
            required
          >
            <InputNumber
              min={1}
              max={24}
              onChange={(e) => this.setState({ times: e })} />
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="Number Seats"
            required
          >
            <InputNumber
              min={1}
              onChange={(e) => this.setState({ numSeats: e })} />
          </Form.Item>

        </Modal>
      </Row>
    )
  }
}

Flight.propTypes = {
  getAirportsRequest: PropTypes.func,
  confirm: PropTypes.func,
  getFlightsRequest: PropTypes.func,
  airports: PropTypes.array,
  flights: PropTypes.array,
}

const mapStateToProps = (state) => ({
  airports: get(state.flight.toJS(), ['airports']) || [],
  flights: get(state.flight.toJS(), ['flights']) || [],
})

const mapDispatchToProps = (dispatch) => ({
  getAirportsRequest: (params, resolve, reject) =>
    dispatch(FlightActions.getAirportsRequest(params, resolve, reject)),
  confirm: (title, content, okText, cancelText, actionSuccess, actionFailure) =>
    dispatch(AppActions.confirm(title, content, okText, cancelText, actionSuccess, actionFailure)),
  createFlightRequest: (params, resolve, reject) =>
    dispatch(FlightActions.createFlightRequest(params, resolve, reject)),
  getFlightsRequest: (params, resolve, reject) =>
    dispatch(FlightActions.getFlightsRequest(params, resolve, reject)),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
const withReducer = injectReducer({ key: 'flight', reducer })
const withSaga = injectSaga({ key: 'flight', saga })

export default compose(withReducer, withSaga, withConnect)(injectIntl(Flight))