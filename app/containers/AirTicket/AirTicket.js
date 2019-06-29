/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row } from 'reactstrap'
import { Card, Button, Icon, Form, Input, Select, DatePicker, Tooltip, Tag } from 'antd'
import { connect } from 'react-redux'
import { get, findIndex, remove } from 'lodash'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import ReactTable from 'react-table'
import { compose } from 'redux'
import { injectIntl } from 'react-intl'
import injectReducer from '../../utils/injectReducer'
import injectSaga from '../../utils/injectSaga'

import AppActions from '../../redux/appRedux'
import AirTicketActions, { reducer } from './airTicketRedux'
import saga from './airTicketSagas'
import { RANK_TICKET } from '../../utils/constants'

const { Option } = Select

const INIT_STATE = {
  fullname: '',
  phone: '',
  email: '',
  address: '',
  identityCard: '',
  birthday: null,
  listSeats: [],
  flightId: '',
  flightFilter: '',
  customerFilter: '',
  rankFilter: '',
}


class AirTicket extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...INIT_STATE,
    }
  }

  componentDidMount = () => {

    const {
      flightsRequest,
      getAirTicketsRequest,
      getCustomersRequest,
    } = this.props

    const params = { limit: 0, skip: 0 }

    // get flights
    if (flightsRequest) flightsRequest(params)

    // get tickets
    if (getAirTicketsRequest) getAirTicketsRequest(params)

    // get customer
    if (getCustomersRequest) getCustomersRequest(params)

  }

  componentDidUpdate = (preProps, prevState) => {
    const { flightId, flightFilter, customerFilter, rankFilter } = this.state
    const { getFlightRequest, getAirTicketsRequest } = this.props
    if (prevState.flightId !== flightId) {
      getFlightRequest({ id: flightId })
    }

    const objQuery = {
      limit: 0,
      skip: 0,
    }

    if (flightFilter) objQuery.flightId = flightFilter
    if (customerFilter) objQuery.customerId = customerFilter
    if (rankFilter) objQuery.ticketRank = rankFilter



    if (prevState.flightFilter !== flightFilter
      || prevState.customerFilter !== customerFilter
      || prevState.rankFilter !== rankFilter) {
      // get tickets
      if (getAirTicketsRequest) getAirTicketsRequest(objQuery)
    }
  }

  handleOk = () => {
    const { confirm, createAirticketRequest } = this.props
    const {
      fullname,
      phone,
      email,
      address,
      identityCard,
      birthday,
      flightId,
      listSeats,
    } = this.state

    confirm(
      `Are you sure to create ticket?`,
      'discriptions',
      'Create',
      'Cancel',
      () => {
        const params = {
          fullname,
          phone,
          email,
          address,
          identityCard,
          birthday,
          flightId,
          listSeats,
        }
        createAirticketRequest(params, () => this.resetForm())
      }
    )

  }

  handleCancel = () => {
    this.resetForm()
  }

  handleChooseSeat = (item) => {
    const { listSeats } = this.state
    const indexItem = findIndex(listSeats, (elm) => elm.seatNumber === item.seatNumber)
    if (indexItem === -1) {
      listSeats.push(item)
      this.setState({ listSeats })
      return
    }
    remove(listSeats, (elm) => elm.seatNumber === item.seatNumber)
    this.setState({ listSeats })
  }

  resetForm = () => {
    this.setState({ ...INIT_STATE })
  }

  render() {

    const {
      fullname,
      address,
      email,
      phone,
      identityCard,
      listSeats,
      flightId,
    } = this.state

    const {
      flights,
      airTickets,
      customers,
      flight,
    } = this.props

    let seatsLuxurious
    let seatsOrdinary
    let priceLuxurious
    let priceOrdinary
    const arrSeats = []
    if (flightId && Object.keys(flight).length > 0) {
      seatsLuxurious = get(flight, ['numSeatsLuxurious'])
      seatsOrdinary = get(flight, ['numSeatsOrdinary'])
      priceLuxurious = get(flight, ['priceLuxurious'])
      priceOrdinary = get(flight, ['priceOrdinary'])
    }

    for (let i = 0; i < seatsLuxurious; i++) {
      arrSeats.push({
        seatNumber: i + 1,
        ticketRank: RANK_TICKET.LUXURIOUS,
        price: priceLuxurious,
      })
    }

    for (let i = seatsLuxurious; i < seatsOrdinary + seatsLuxurious; i++) {
      arrSeats.push({
        seatNumber: i + 1,
        ticketRank: RANK_TICKET.ORDINARY,
        price: priceOrdinary,
      })
    }

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
          <title>AirTicket</title>
          <meta name="airport" content="Description of Airport" />
        </Helmet>

        <div className="row w-100">
          <div className="col-lg-6">
            <Card
              title="Ticket"
              size="small"
              className="w-100 mb-4"
            >
              <Form.Item
                {...formItemLayout}
                className="mb-0"
                label="Full name"
                required
              >
                <Input
                  placeholder="Please enter your fullname"
                  style={{ width: '90%' }}
                  value={fullname}
                  onChange={(e) => this.setState({ fullname: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                className="mb-0"
                {...formItemLayout}
                label="Phone"
                required
              >
                <Input
                  placeholder="Please enter your phone"
                  style={{ width: '50%' }}
                  value={phone}
                  onChange={(e) => this.setState({ phone: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                className="mb-0"
                {...formItemLayout}
                label="Email"
              >
                <Input
                  placeholder="Please enter your email"
                  style={{ width: '70%' }}
                  value={email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                className="mb-0"
                {...formItemLayout}
                label="Address"
              >
                <Input
                  placeholder="Please enter your address"
                  value={address}
                  onChange={(e) => this.setState({ address: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                className="mb-0"
                {...formItemLayout}
                label="Identity Card"
                required
              >
                <Input
                  placeholder="Please enter your identity card"
                  style={{ width: '60%' }}
                  value={identityCard}
                  onChange={(e) => this.setState({ identityCard: e.target.value })}
                />
              </Form.Item>

              <Form.Item
                className="mb-0"
                {...formItemLayout}
                label="Birthday"
              >
                <DatePicker
                  onChange={(e) => this.setState({ birthday: moment(e).toDate() })}
                  onOk={(e) => this.setState({ birthday: moment(e).toDate() })}
                />
              </Form.Item>

              <Form.Item
                className="mb-0"
                {...formItemLayout}
                label="Flight"
                required
              >
                <Select
                  style={{ width: 300 }}
                  placeholder="Choose flight"
                  onChange={(e) => this.setState({ flightId: e, listSeats: [] })}
                >
                  {flights.length > 0 && flights.map((item) => (
                    <Option key={item._id} value={item._id}>
                      <Tooltip title={`${get(item, ['fromAirport', 'name'])} - ${get(item, ['toAirport', 'name'])}`}>
                        <span> {`${get(item, ['fromAirport', 'name'])} - ${get(item, ['toAirport', 'name'])}`}</span>
                      </Tooltip>,
                    </Option>
                  ))}
                </Select>
              </Form.Item>


            </Card>

          </div>
          <div className="col-lg-6" style={{ height: 392 }}>
            <Card
              title="Select seat"
              size="small"
              className="w-100 h-100"
              style={{ position: 'relative' }}
            >
              {
                flightId ?
                  (
                    <Row className="mt-2 ml-1">
                      {arrSeats.map((item, idx) => (
                        <a
                          key={idx}
                          onClick={() => this.handleChooseSeat(item)}
                          role="button"
                          tabIndex="0"
                        >
                          <div
                            style={{ height: 30, width: 30 }}
                            className={`d-flex border m-1 rounded justify-content-center p-0 align-items-center
                    ${get(item, ['ticketRank']) === RANK_TICKET.LUXURIOUS ? 'bg-primary' : 'bg-secondary'}
                    ${findIndex(listSeats, (elm) => elm.seatNumber === item.seatNumber) !== -1 ? 'font-weight-bold bg-danger' : ''}
                    `}
                          >
                            <Tooltip title={`Ticket rank: ${get(item, ['ticketRank'])}`}>
                              <span>{get(item, ['seatNumber'])}</span>
                            </Tooltip>
                          </div>
                        </a>
                      ))}
                    </Row>
                  ) : (
                    <React.Fragment>
                      <div className="row w-100  justify-content-center mt-5 pt-5">
                        <Icon style={{ fontSize: 50, color: '#777' }} type="info-circle" />
                      </div>
                      <div className="row w-100 justify-content-center mt-2">
                        <div>Please select flight before choose seat</div>
                      </div>
                    </React.Fragment>
                  )
              }

              <div className="row w-100 justify-content-end pr-4" style={{ position: 'absolute', bottom: 15 }}>
                <Button
                  icon="plus-circle"
                  type="primary"
                  className="bg-success mr-2"
                  onClick={this.handleOk} >
                  Create
                </Button>
                <Button
                  icon="close-circle"
                  type="primary"
                  className="bg-danger"
                  onClick={this.handleCancel} >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Card
          title="Air ticket list"
          size="small"
          className="w-100"
          style={{ marginRight: 30 }}
        >
          <div className="row mb-4 mt-2 mr-3">
            <div className="col-lg-4">
              <div className="d-flex row  align-item-center ml-2">
                <span className="mt-1 mr-3">Flight:</span>
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: 250 }}
                  placeholder="Choose flight"
                  onChange={(e) => this.setState({ flightFilter: e })}
                >
                  {flights.length > 0 && flights.map((item) => (
                    <Option key={item._id} value={item._id}>
                      <Tooltip title={`${get(item, ['fromAirport', 'name'])} - ${get(item, ['toAirport', 'name'])}`}>
                        <span> {`${get(item, ['fromAirport', 'name'])} - ${get(item, ['toAirport', 'name'])}`}</span>
                      </Tooltip>,
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="d-flex row  align-item-center ml-2">
                <span className="mt-1 mr-3">Customer:</span>
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: 200 }}
                  placeholder="Choose type"
                  onChange={(e) => this.setState({ customerFilter: e })}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {customers.map((item, index) => (
                    <Option key={index} value={item._id}>{item.fullname}</Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="d-flex row  align-item-center ml-2">
                <span className="mt-1 mr-3">Rank:</span>
                <Select
                  style={{ width: 150 }}
                  placeholder="Choose type"
                  onChange={(e) => this.setState({ rankFilter: e })}
                >
                  <Option value="">All</Option>
                  <Option value={RANK_TICKET.LUXURIOUS}>Luxurious</Option>
                  <Option value={RANK_TICKET.ORDINARY}>Ordinary</Option>
                </Select>
              </div>
            </div>
            <div className="col-lg-1 pr-3">
              <Button type="primary" ghost onClick={() => this.resetForm()}>Reset</Button>
            </div>
          </div>

          {
            airTickets.length > 0
            && customers.length > 0
            && flights.length > 0
            && (
              <ReactTable
                data={airTickets}
                defaultPageSize={8}
                columns={[{
                  Header: 'Customer name',
                  id: 'customerName',
                  accessor: d => get(customers[findIndex(customers, (customer) => customer._id === d.customer)], ['fullname']),
                },
                {
                  Header: 'From',
                  id: 'from',
                  accessor: d => get(flights[findIndex(flights, (flight) => flight._id === d.flight)], ['fromAirport', 'name'], ''),
                },
                {
                  Header: 'To',
                  id: 'to',
                  accessor: d => get(flights[findIndex(flights, (flight) => flight._id === d.flight)], ['toAirport', 'name'], ''),
                },
                {
                  Header: 'Seat number',
                  id: 'seatNumber',
                  accessor: d => get(d, ['seatNumber']),
                },
                {
                  Header: 'Ticket rank',
                  id: 'ticketRank',
                  accessor: d => get(d, ['ticketRank']),
                  Cell: props => <Tag color={props.value === RANK_TICKET.ORDINARY ? 'green' : 'magenta'}>{props.value === RANK_TICKET.ORDINARY ? 'Ordinary' : 'Luxurious'}</Tag>,
                },
                {
                  Header: 'Price',
                  id: 'price',
                  accessor: d => `${get(d, ['price'])} VNĐ`,
                },
                ]}
              />
            )
          }
        </Card>
      </Row>
    )
  }
}

AirTicket.propTypes = {
  flights: PropTypes.array,
  flight: PropTypes.object,
  airTickets: PropTypes.array,
  customers: PropTypes.array,
  createAirportRequest: PropTypes.func,
  airportsRequest: PropTypes.func,
  deleteAirportRequest: PropTypes.func,
  confirm: PropTypes.func,
  updateAirportRequest: PropTypes.func,
  getCustomersRequest: PropTypes.func,
  getFlightRequest: PropTypes.func,
}

const mapStateToProps = (state) => ({
  flights: get(state.airTicket.toJS(), ['flights']) || [],
  flight: get(state.airTicket.toJS(), ['flight']) || {},
  airTickets: get(state.airTicket.toJS(), ['airTickets'], []),
  customers: get(state.airTicket.toJS(), ['customers'], []),
})

const mapDispatchToProps = (dispatch) => ({
  flightsRequest: (params, resolve, reject) =>
    dispatch(AirTicketActions.flightsRequest(params, resolve, reject)),
  confirm: (title, content, okText, cancelText, actionSuccess, actionFailure) =>
    dispatch(AppActions.confirm(title, content, okText, cancelText, actionSuccess, actionFailure)),
  createAirticketRequest: (params, resolve, reject) =>
    dispatch(AirTicketActions.createAirticketRequest(params, resolve, reject)),
  getAirTicketsRequest: (params, resolve, reject) =>
    dispatch(AirTicketActions.getAirTicketsRequest(params, resolve, reject)),
  getCustomersRequest: (params, resolve, reject) =>
    dispatch(AirTicketActions.getCustomersRequest(params, resolve, reject)),
  getFlightRequest: (params, resolve, reject) =>
    dispatch(AirTicketActions.getFlightRequest(params, resolve, reject)),
})

const withReducer = injectReducer({ key: 'airTicket', reducer })
const withSaga = injectSaga({ key: 'airTicket', saga })
const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withReducer, withSaga, withConnect)(injectIntl(AirTicket))