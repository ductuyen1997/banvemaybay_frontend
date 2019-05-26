import React, { Component } from 'react'
import { Row } from 'reactstrap'
import { Card, Button, Modal, Form, Input, Select } from 'antd'
import { connect } from 'react-redux'
import { get, findIndex} from 'lodash'
import { Helmet } from 'react-helmet'
import ReactTable from 'react-table'

import AirportActions from '../../redux/airportRedux'
import { CITY_CODES } from '../../utils/constants'

const cityCode = []

class Airport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      name: '',
      address: '',
      city: '',
      photo: '',
    }
  }

  componentDidMount = () => {
    this.createArrayCityCode()
    this.props.airportsRequest({ limit: 0, skip: 0 })
  }

  createArrayCityCode = () => {
    CITY_CODES.forEach((code, city) => cityCode.push({ city, code }))
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  };

  showConfirm = () => {
    const that = this
    Modal.confirm({
      title: 'Do you Want to Create Airport?',
      content: 'Some descriptions',
      onOk() {
        that.handleSubmit()
      },
      onCancel() { },
    })
  }

  showSuccess = () => {
    Modal.success({
      title: 'This is a success message',
      content: 'some messages...some messages...',
    })
    this.resetForm()
  }

  handleOk = () => {
    this.showConfirm()
  };

  handleCancel = () => {
    this.resetForm()
  };

  handleSubmit = () => {
    const { name, address, city, photo } = this.state
    const params = { name, address, city, photo }
    this.props.createAirportRequest(params, () => this.showSuccess())
  }


  resetForm = () => {
    this.setState({
      visible: false,
      name: '',
      address: '',
      city: '',
      photo: '',
    })
  }

  renderCity = (item, index) => (
    <Select.Option key={index}>
      {item.city}
    </Select.Option>
  )

  render() {
    const { visible, name, address, photo } = this.state
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
            onClick={this.showModal} >
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
                  accessor: d => cityCode[findIndex(cityCode, item => +item.code === +d.city)].city,
                }, {
                  Header: 'Actions',
                  accessor: '_id',
                  // eslint-disable-next-line no-unused-vars
                  Cell: (props) => (
                    <div>
                      <Button
                        type="primary"
                        icon="form"
                        size="small"
                        ghost>Edit</Button>
                      <Button
                        className="ml-1"
                        type="danger"
                        icon="delete"
                        size="small"
                        ghost>Delete</Button>
                    </div>
                  ),
                }]}
              />
            )
          }
        </Card>

        <Modal
          title="Create Airport"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
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
              showSearch
              style={{ width: 200 }}
              placeholder="Select a city"
              onChange={(e) => this.setState({ city: cityCode[e].code })}
            >
              {cityCode.map(this.renderCity)}
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

const mapStateToProps = (state) => ({
  airports: get(state.airport.toJS(), ['airports']),
})

const mapDispatchToProps = (dispatch) => ({
  createAirportRequest: (params, resolve, reject) =>
    dispatch(AirportActions.createAirportRequest(params, resolve, reject)),
  airportsRequest: (params, resolve, reject) =>
    dispatch(AirportActions.airportsRequest(params, resolve, reject)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Airport)