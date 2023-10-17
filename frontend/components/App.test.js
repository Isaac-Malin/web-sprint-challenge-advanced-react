import React from "react"
import App from './AppFunctional'

// Write your tests here
test('render without error', () => {
  expect(<App />).toBeInTheDocument
})
