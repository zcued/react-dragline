import React from 'react'
import ReactDOM from 'react-dom'
import update from 'immutability-helper'
import { DraggableContainer, DraggableChild } from '../src/index'


const initialChildren = [
  { id: 1, background: '#0000FF', size: 100, position: {x: 100, y: 0} },
  { id: 2, background: '#0000FF', size: 100, position: {x: 200, y: 106} },
  { id: 3, background: '#00FF99', size: 102, position: {x: 500, y: 106} },
  { id: 4, background: '#333366', size: 150, position: {x: 100, y: 316} },
  { id: 5, background: '#CC66FF', size: 200, position: {x: 480, y: 376} },
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
          this.state.children.map(({ id, background, size, position }, index) => {
            const style = {
              background,
              width: size,
              height: size,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }

            return (
              <DraggableChild key={id} position={position} handleChange={position => this.handleChange(index, position)}>
                <div style={style}>
                  <span>size: {size}</span>
                  <span>drag me</span>
                </div>
              </DraggableChild>
            )
          })
        }
      </DraggableContainer>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
