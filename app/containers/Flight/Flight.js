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
  numSeatsLuxurious: null,
  priceLuxurious: null,
  numSeatsOrdinary: null,
  priceOrdinary: null,
  isUpdate: false,
  flightUpdateId: '',
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
      numSeatsLuxurious,
      priceLuxurious,
      numSeatsOrdinary,
      priceOrdinary,
      isUpdate,
      flightUpdateId,
    } = this.state
    const { confirm, createFlightRequest, updateFlightRequest } = this.props

    if (isUpdate) {
      confirm(
        `Are you sure to update flight?`,
        'Once you clicked update can\'t undo',
        'Yes',
        'No',
        () => updateFlightRequest(flightUpdateId,
          {
            fromAirportId,
            toAirportId,
            flightTime,
            times,
            numSeatsLuxurious,
            priceLuxurious,
            numSeatsOrdinary,
            priceOrdinary,
          },
          this.resetForm(),
        )
      )
      return
    }

    confirm(
      `Are you sure to create flight?`,
      'discriptions',
      'Create',
      'Cancel',
      () => {
        const params = {
          fromAirportId,
          toAirportId,
          flightTime,
          times,
          numSeatsLuxurious,
          priceLuxurious,
          numSeatsOrdinary,
          priceOrdinary,
        }
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

  onClickDeleteFlight(flight, index) {
    const { deleteFlightRequest, confirm } = this.props
    confirm(
      `Are you sure to delete flight?`,
      'Once you clicked delete can\'t undo',
      'Delete',
      'Cancel',
      () => deleteFlightRequest(flight._id, index)
    )
  }

  // Click update flight 
  onClickUpdateFlight(flight) {
    this.setState({
      fromAirportId: flight._id,
      toAirportId: flight._id,
      flightTime: flight.times,
      times: flight.times,
      numSeatsLuxurious: flight.numSeatsLuxurious,
      priceLuxurious: flight.priceLuxurious,
      numSeatsOrdinary: flight.numSeatsOrdinary,
      priceOrdinary: flight.priceOrdinary,
      flightUpdateId: flight._id,
      visible: true,
      isUpdate: true,
    })
  }

  renderSelectAirports = (airport) => (
    <Option
      key={airport._id}
      value={airport._id}>
      {airport.name}
    </Option>
  )

  render() {
    const {
      visible,
      isUpdate,
      times,
      numSeatsLuxurious,
      priceLuxurious,
      numSeatsOrdinary,
      priceOrdinary,
    } = this.state
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
          <title>Flight</title>
          <meta name="flight" content="Description of flight" />
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
            onClick={() => {
              this.resetForm()
              this.setState({ visible: true })
            }} >
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
                },
                {
                  id: 'numseats',
                  Header: 'Number seats',
                  accessor: d => `${d.numSeatsLuxurious + d.numSeatsOrdinary} seats`,
                },
                {
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
                        onClick={() => this.onClickUpdateFlight(row.original)}>Update</Button>
                      <Button
                        className="ml-1"
                        type="danger"
                        icon="delete"
                        size="small"
                        onClick={() => this.onClickDeleteFlight(row.original, row.index)}
                        ghost>Delete</Button>
                    </div>
                  ),
                },
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
              {isUpdate ? 'Update' : 'Create'}
            </Button>,
          ]}
        >
          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="From"
            required
          >
            {
              airports.length > 0 && (
                <Select
                  placeholder="Please select from airport"
                  showSearch
                  style={{ width: 300 }}
                  onChange={(e) => this.setState({ fromAirportId: e })}
                >
                  {airports.length > 0 && airports.map(this.renderSelectAirports)}
                </Select>
              )
            }
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="To"
            required
          >
            <Select
              placeholder="Please select to airport"
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
            label="Seats luxurious "
            required
          >
            <InputNumber
              style={{ width: 220 }}
              placeholder="Number seats luxurious"
              min={1}
              value={numSeatsLuxurious}
              onChange={(e) => this.setState({ numSeatsLuxurious: e })} />
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="Price luxurious"
            required
          >
            <InputNumber
              style={{ width: 180 }}
              placeholder="Price seats luxurious"
              min={1}
              value={priceLuxurious}
              onChange={(e) => this.setState({ priceLuxurious: e })} />
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="Seats ordinary "
            required
          >
            <InputNumber
              style={{ width: 220 }}
              placeholder="Number seats ordinary"
              min={1}
              value={numSeatsOrdinary}
              onChange={(e) => this.setState({ numSeatsOrdinary: e })} />
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            className="mb-0"
            label="Price ordinary"
            required
          >
            <InputNumber
              style={{ width: 180 }}
              placeholder="Price seats ordinary"
              min={1}
              value={priceOrdinary}
              onChange={(e) => this.setState({ priceOrdinary: e })} />
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
              placeholder="Enter times"
              style={{ width: 150 }}
              min={1}
              max={24}
              value={times}
              onChange={(e) => this.setState({ times: e })} />
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
  updateFlightRequest: PropTypes.func,
  deleteFlightRequest: PropTypes.func,
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
  deleteFlightRequest: (flightId, index) =>
    dispatch(FlightActions.deleteFlightRequest(flightId, index)),
  updateFlightRequest: (flightId, params) =>
    dispatch(FlightActions.updateFlightRequest(flightId, params)),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
const withReducer = injectReducer({ key: 'flight', reducer })
const withSaga = injectSaga({ key: 'flight', saga })

export default compose(withReducer, withSaga, withConnect)(injectIntl(Flight))