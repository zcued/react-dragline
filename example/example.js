import React from 'react'
import ReactDOM from 'react-dom'
import update from 'immutability-helper'
import { DraggableContainer, DraggableChild } from '../src/index'


const initialChildren = [
  { id: 1, color: '#0000FF', size: 96, position: {x: 0, y: 0} },
  { id: 2, color: '#00FF99', size: 100, position: {x: 0, y: 106} },
  { id: 3, color: '#333366', size: 150, position: {x: 150, y: 216} },
  { id: 4, color: '#CC66FF', size: 200, position: {x: 280, y: 376} },
]

class Example extends React.Component {
  state = {
    children: initialChildren,
  }

  handleChange = (index, position) => {
    const children = update(this.state.children, {
      [index]: {position: {$set: position}},
    })

    this.setState({children})
  }

  render() {
    return (
      <DraggableContainer style={{height: 600, border: '1px solid #ddd'}}>
        {
          this.state.children.map(({ id, color, size, position }, index) => {
            const style = { background: color, width: size, height: size }

            return (
              <DraggableChild key={id} position={position} handleChange={position => this.handleChange(index, position)}>
                <div style={style} />
              </DraggableChild>
            )
          })
        }
      </DraggableContainer>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
