import React from 'react'
import { DraggableCore } from 'react-draggable'
import PropTypes from 'prop-types'

// const noop = () => {}

export default class DraggableChild extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    initialize: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  state = {
    x: 0,
    y: 0,
  }

  componentWillUnmount() {
    this.props.destroy()
  }

  handleDrag = (ev, b) => {
    const x = b.deltaX + this.state.x
    const y = b.deltaY + this.state.y

    this.setState({ x, y })
  }

  render() {
    const { x, y } = this.state
    const child = this.props.children
    const style = { ...child.props.style, transform: `translate(${x}px, ${y}px)` }

    return (
      <DraggableCore
        grid={[1, 1]}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        position={{ x, y }}
      >
        {React.cloneElement(this.props.children, {
          style,
          ref: ref => this.props.initialize(ref),
        })}
      </DraggableCore>
    )
  }
}


// export default class DraggableChild extends React.Component {
//   static propTypes = {
//     handleDragStart: PropTypes.func,
//     handleDragStop: PropTypes.func,
//     handleDragging: PropTypes.func,
//     transChildPosition: PropTypes.func,
//     adsorptionValues: PropTypes.shape({
//       left: PropTypes.arrayOf(PropTypes.number),
//       top: PropTypes.arrayOf(PropTypes.number),
//     }),
//   }

//   // eslint 无法检测到 React.cloneElement 传入的Props
//   static defaultProps = {
//     handleDragStart: noop,
//     handleDragging: noop,
//     handleDragStop: noop,
//     transChildPosition: noop,
//     adsorptionValues: { left: [], top: [] },
//   }

//   constructor(props) {
//     super(props)
//     this.dragging = false
//     this.state = {
//       style: {},
//     }
//   }

//   handleStart = () => {}

//   handleDrag = (ev, b) => {
//     if (!this.dragging) {
//       this.dragging = true
//       this.props.handleDragStart()
//     }

//     this.checkAdsorption(b)
//     this.props.handleDragging()
//   }

//   handleStop = () => {
//     this.dragging = false
//     this.props.handleDragStop()
//   }

//   checkAdsorption({ x, y, node }) {
//     const { left } = node.getBoundingClientRect()
//     let threshold = 5
//     let absorptionValue = null

//     this.props.adsorptionValues.left.forEach(v => {
//       if (Math.abs(left - v) <= threshold) {
//         absorptionValue = x + (left - v)
//         threshold = Math.abs(left - v)
//       }
//     })

//     if (absorptionValue === null) {
//       this.setState({ style: {} })
//     } else {
//       this.setState({ style: { transform: `translate(${absorptionValue}px, ${y})px` } })
//     }
//   }

//   render() {
//     const { transChildPosition, children } = this.props

//     return (
//       <Draggable
//         onStart={this.handleStart}
//         onDrag={this.handleDrag}
//         onStop={this.handleStop}
//       >
//         <Middleware
//           transChildPosition={transChildPosition}
//           correctStyle={this.state.style}
//         >{children}
//         </Middleware>
//       </Draggable>
//     )
//   }
// }

// // 用一个middleware 承接Draggable传递的style，以此获得控制拖拽的能力并实现吸附的功能
// // 使用controlled模式作为拖拽的底层实现似乎是更好的选择，待后续思考~
// const Middleware = (props) => {
//   const { transChildPosition, correctStyle, ...draggableProps } = props
//   draggableProps.style = { ...draggableProps.style, ...correctStyle }
//   const realProps = { ref: transChildPosition, ...draggableProps }
//   return React.cloneElement(props.children, realProps)
// }
