import React, { Component } from 'react'
import { Row } from 'reactstrap'
import { Card, Button, Modal, Form, Input } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import AirportActions from '../../redux/airportRedux'

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
        that.showSuccess()
      },
      onCancel() { },
    })
  }

  showSuccess = () => {
    Modal.success({
      title: 'This is a success message',
      content: 'some messages...some messages...',
    })
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
    this.props.createAirportRequest(params)
    console.log(params)
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

  render() {
    const { visible, name, address, city, photo } = this.state
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
            type="primary"
            size="small"
            className="bg-success"
            onClick={this.showModal} >
            Create
          </Button>}
        >

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
            <Input
              value={city}
              onChange={(e) => this.setState({ city: e.target.value })}
            />
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

const mapDispatchToProps = (dispatch) => ({
  createAirportRequest: (params, resolve, reject) => dispatch(AirportActions.createAirportRequest(params, resolve, reject)),
})

export default connect(null, mapDispatchToProps)(Airport)