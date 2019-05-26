import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Notification from 'containers/Notification'
import Spinners from 'components/Spinners'

import AppActions from '../../redux/appRedux'

// Global custom styles
import '../../scss/_custom.scss'

const Signin = React.lazy(() => import('containers/Signin'))
const Signup = React.lazy(() => import('containers/Signup'))
const Page404 = React.lazy(() => import('containers/Page404'))
const Page500 = React.lazy(() => import('containers/Page500'))
const DefaultLayout = React.lazy(() => import('containers/DefaultLayout'))

class App extends Component {
  componentDidMount() {
    const { startupWorkingFlow, history } = this.props
    startupWorkingFlow(history)
  }

  render() {
    const { isReady } = this.props
    if (isReady) {
      return (
        <div>
          <Notification />
          <Suspense fallback={<Spinners pulse />}>
            <Switch>
              <Route
                exact
                path="/signin"
                name="Signin Page"
                render={props => <Signin {...props} />}
              />
              <Route
                exact
                path="/signup"
                name="Signup Page"
                render={props => <Signup {...props} />}
              />
              <Route
                exact
                path="/404"
                name="Page 404"
                render={props => <Page404 {...props} />}
              />
              <Route
                exact
                path="/500"
                name="Page 500"
                render={props => <Page500 {...props} />}
              />
              <Route
                path="/"
                name="DefaultLayout"
                render={props => <DefaultLayout {...props} />}
              />
            </Switch>
          </Suspense>
        </div>
      )
    }
    return null
  }
}

App.propTypes = {
  startupWorkingFlow: PropTypes.func,
  isReady: PropTypes.bool,
  history: PropTypes.object,
}

const mapStateToProps = state => ({
  isReady: state.app.get('isReady'),
})

const mapDispatchToProps = dispatch => ({
  startupWorkingFlow: (history) => {
    dispatch(AppActions.startupWorkingFlow(history))
  },
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
)
