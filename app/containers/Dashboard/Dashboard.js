import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card } from 'antd'
import { Helmet } from 'react-helmet'
import { compose } from 'redux'
import { HorizontalBar, Bar } from 'react-chartjs-2'
import { injectIntl } from 'react-intl'
import { get } from 'lodash'

import injectReducer from '../../utils/injectReducer'
import injectSaga from '../../utils/injectSaga'
import AirTicketActions, { reducer } from '../AirTicket/airTicketRedux'
import saga from '../AirTicket/airTicketSagas'

const options = {
  scales: {
    xAxes: [{
      stacked: true,
    }],
    yAxes: [{
      stacked: true,
    }],
  },
}
class Dashboard extends Component {

  componentDidMount = () => {
    const {
      getAirTicketsRequest,
      flightsRequest,
    } = this.props

    const params = { limit: 0, skip: 0 }

    // get flights
    if (getAirTicketsRequest) getAirTicketsRequest(params)

    // get flight
    if (flightsRequest) flightsRequest(params)
  }

  render() {
    const { airTickets, flights } = this.props

    let dataFlight
    let dataSeats

    if (airTickets.length > 0 && flights.length > 0) {
      const label = []
      const data = []
      const luxu = []
      const ordi = []
      flights.forEach(flight => {
        label.push(`${get(flight, ['fromAirport', 'name'])} - ${get(flight, ['toAirport', 'name'])}`)
        let sum = 0
        airTickets.forEach(elm => {
          if (elm.flight === flight._id) {
            sum += elm.price
          }
        })
        data.push(sum)
        luxu.push(get(flight, ['numSeatsLuxurious']))
        ordi.push(get(flight, ['numSeatsOrdinary']))
      })


      dataFlight = {
        labels: label,
        type: 'horizontalBar',
        datasets: [
          {
            label: 'Tổng doanh thu chuyến bay',
            backgroundColor: '#FF6384',
            borderColor: '#FF6384',
            borderWidth: 1,
            hoverBackgroundColor: '#ff0000',
            hoverBorderColor: '#ff0000',
            data,
          },
        ],
      }

      dataSeats = {
        datasets: [{
          label: 'Luxurious seats',
          data: luxu,
          backgroundColor: '#36A2EB',
        },
        {
          label: 'Ordinary seats',
          data: ordi,
          backgroundColor: '#FFCE56',
        }],
        labels: label,
      }
    }





    return (
      <div>
        <Helmet>
          <title>Dashboard</title>
          <meta name="description" content="Description of Dashboard" />
        </Helmet>
        <div className="row w-100">
          <Card
            title="Doanh thu từng chuyến bay"
            size="small"
            className="w-100"
          >
            <HorizontalBar
              data={dataFlight}
              width='100%'
              height={300}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </Card>
        </div>
        <div className="row w-100 mt-4">
          <Card
            title="Cơ cấu loại ghế của từng chuyến bay"
            size="small"
            className="w-100"
          >
            <Bar data={dataSeats} options={options} />
          </Card>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  getAirTicketsRequest: PropTypes.func,
  airTickets: PropTypes.array,
  flightsRequest: PropTypes.func,
  flights: PropTypes.array,
}

const mapStateToProps = (state) => ({
  airTickets: get(state.airTicket.toJS(), ['airTickets'], []),
  flights: get(state.airTicket.toJS(), ['flights']) || [],
})

const mapDispatchToProps = (dispatch) => ({
  getAirTicketsRequest: (params, resolve, reject) =>
    dispatch(AirTicketActions.getAirTicketsRequest(params, resolve, reject)),
  flightsRequest: (params, resolve, reject) =>
    dispatch(AirTicketActions.flightsRequest(params, resolve, reject)),
})

const withReducer = injectReducer({ key: 'airTicket', reducer })
const withSaga = injectSaga({ key: 'airTicket', saga })
const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withReducer, withSaga, withConnect)(injectIntl(Dashboard))