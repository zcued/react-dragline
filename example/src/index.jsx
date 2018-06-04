import React from 'react'
import ReactDom from 'react-dom'
import App from './route'

const domRoot = document.getElementById('root')

ReactDom.render(<App />, domRoot)

if (module.hot) {
  module.hot.accept('./route', () => {
    const NextApp = App.default
    ReactDom.render(NextApp, domRoot)
  })
}
