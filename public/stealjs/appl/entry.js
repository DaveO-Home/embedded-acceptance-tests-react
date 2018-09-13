import React from 'react'
import ReactDOM from 'react-dom'
import Menulinks from 'Menulinks'

if (typeof testit === 'undefined' || !testit) {
  ReactDOM.render(
    <Menulinks />,
    document.getElementById('root')
  )
}
