import React from 'react'
import PropTypes from 'prop-types'
// import styled from 'styled-components'
// import { unique } from './utils'

// const VLine = styled.span`
//   position: absolute;
//   top: 0;
//   width: 1px;
//   height: 100%;
//   background: #00FFFF;
// `

// const HLine = styled.span`
//   position: absolute;
//   left: 0;
//   width: 100%;
//   height: 1px;
//   background: #00FFFF;
// `

// const alignTypes = Object.freeze({
//   t: 'top',
//   l: 'left',
//   b: 'bottom',
//   r: 'right',
//   v: 'ver',
//   h: 'hor',
// })

export default class DraggableContainer extends React.PureComponent {
  static propTypes = {
    tag: PropTypes.string,
  }

  static defaultProps = {
    tag: 'div',
  }

  constructor(props) {
    super(props)

    this.children = []
  }

  componentDidMount() {

  }

  // 初始化 child html dom
  initChildDom = (ref, index) => {
    this.children[index] = ref
  }

  // 清除 this.children 内已被删除的 html dom
  destroyChildDom = (index) => {
    this.children.splice(index, 1)
  }

  render() {
    const Tag = this.props.tag

    return (
      <Tag>
        {this.props.children.map((child, index) => React.cloneElement(child, {
          initialize: ref => this.initChildDom(ref, index),
          destroy: () => this.destroy(index),
        }))}
      </Tag>
    )
  }
}

// export default class DraggableContainer extends React.Component {
//   static propTypes = {
//     tag: PropTypes.string,
//     alignment: PropTypes.arrayOf(PropTypes.string),
//   }

//   static defaultProps = {
//     tag: 'div',
//     /**
//      * tt: top top 第一个字母表示拖拽元素，第二个字母表示对齐元素，
//      * rl: right-left 拖拽元素的右边和其它元素的左边对齐
//      * lr: left-right 拖拽元素的左边和其它元素的右边对齐
//      */
//     alignment: ['tt', 'bb', 'hh', 'll', 'rr', 'vv'],
//   }

//   constructor(props) {
//     super(props)
//     this.state = {
//       vLine: [],
//       hLine: [],
//       adsorptionValues: { left: [], top: [] },
//     }

//     this.draggingChildIndex = -1
//     this.$target = {}
//     this.$children = []
//   }

//   componentWillUpdate() {
//     this.$children = []
//   }

//   // top bottom hor => 真实样式为top
//   // left right ver => 展示坐样式为left
//   static getLineStyleDirection(key) {
//     return ['t', 'b', 'h'].includes(key[0]) ? 'top' : 'left'
//   }

//   getContainerPosition = (ref) => {
//     const rect = ref.getBoundingClientRect()
//     const { top, left } = rect
//     this.$target = {
//       $ref: ref,
//       top,
//       left,
//     }
//   }

//   getChildPosition = (index) => ref => {
//     if (!ref) return
//     const rect = ref.getBoundingClientRect()
//     const { top, bottom, left, right, width, height } = rect
//     this.$children[index] = {
//       $ref: ref,
//       width,
//       height,
//       top,
//       bottom,
//       hor: Math.round(((bottom - top) / 2) + top), // 垂直中线坐标
//       left,
//       right,
//       ver: Math.round(((right - left) / 2) + left), // 水平中线坐标
//     }
//   }

//   checkRenderGuideLine() {
//     const index = this.draggingChildIndex
//     const {
//       top, bottom, left, right,
//     } = this.$children[index].$ref.getBoundingClientRect()
//     const targetRect = {
//       top,
//       bottom,
//       ver: Math.round(((right - left) / 2) + left),
//       left,
//       right,
//       hor: Math.round(((bottom - top) / 2) + top),
//     }
//     const lines = { left: [], top: [] }

//     for (let i = 0; i < this.$children.length; i++) {
//       if (i !== index) {
//         const rect = this.$children[i]
//         this.props.alignment.forEach(alignKeys => {
//           const targetAlign = targetRect[alignTypes[alignKeys[0]]]
//           const compareAlign = rect[alignTypes[alignKeys[1]]]

//           if (targetAlign === compareAlign) {
//             const direKey = DraggableContainer.getLineStyleDirection(alignKeys)
//             lines[direKey].push(targetAlign - this.$target[direKey])
//           }
//         })
//       }
//     }

//     const vLine = unique(lines.left)
//     const hLine = unique(lines.top)

//     this.setState({ vLine, hLine })
//   }

//   // 拖拽开始，设置拖拽的目标，计算需要吸附的坐标
//   handleDragStart = index => () => {
//     this.draggingChildIndex = index
//     this.calcAdsorptionValues(index)
//   }

//   // 拖拽中，检查是否需要展示拖拽辅助线
//   handleDragging = () => {
//     this.checkRenderGuideLine()
//   }

//   handleDragStop = () => {
//     this.draggingChildIndex = -1
//     this.$children = []
//     this.setState({ vLine: [], hLine: [] })
//   }

//   calcAdsorptionValues() {
//     const index = this.draggingChildIndex
//     const targetRect = this.$children[index]
//     const adsorptionValues = { left: [], top: [] }
//     for (let i = 0; i < this.$children.length; i++) {
//       if (i !== index) {
//         const rect = this.$children[i]
//         this.props.alignment.forEach(alignKey => {
//           const args = { ...rect, height2: targetRect.height, width2: targetRect.width }
//           const { key, value } = this.calcAdsorptionValue(alignKey, args)
//           adsorptionValues[key].push(value)
//         })
//       }
//     }

//     adsorptionValues.top = unique(adsorptionValues.top)
//     adsorptionValues.left = unique(adsorptionValues.left)
//     this.setState({ adsorptionValues })
//   }

//   /**
//    * 吸附计算方式:
//    *
//    * height1, width1: 对照组元素的数值
//    * height2, width2: 实验组元素的高度
//    * top, bottom, left, right, height, width: 均为对照组的数值
//    */
//    calcAdsorptionValue= (key, values) => {
//      const { top, bottom, left, right, hor, ver, width, height, height2, width2 } = values
//      switch (key) {
//        case 'tt':
//          return { key: 'top', value: top }
//        case 'bb':
//          return { key: 'top', value: bottom + height }
//        case 'tb':
//          return { key: 'top', value: bottom }
//        case 'bt':
//          return { key: 'top', value: top - height }
//        case 'hh':
//          return { key: 'top', value: hor + (height2 / 2) }
//        case 'll':
//          return { key: 'left', value: top }
//        case 'rr':
//          return { key: 'left', value: right - width }
//        case 'rl':
//          return { key: 'left', value: left - width }
//        case 'lr':
//          return { key: 'left', value: right }
//        case 'vv':
//          return { key: 'left', value: ver - (width2 / 2) }
//        default:
//          return {}
//      }
//    }

//    _renderGuideLine() {
//      const { vLine, hLine } = this.state
//      return (
//        <React.Fragment>
//          {vLine.map(v => <VLine key={`v-${v}`} style={{ left: v }} />)}
//          {hLine.map(h => <HLine key={`h-${h}`} style={{ top: h }} />)}
//        </React.Fragment>
//      )
//    }

//    render() {
//      const Tag = this.props.tag
//      return (
//        <Tag style={{ position: 'relative' }} ref={this.getContainerPosition}>
//          {this.props.children.map((child, index) => React.cloneElement(child, {
//             transChildPosition: this.getChildPosition(index),
//             handleDragStart: this.handleDragStart(index),
//             handleDragging: this.handleDragging,
//             handleDragStop: this.handleDragStop,
//             adsorptionValues: this.state.adsorptionValues,
//           }))}
//          {this._renderGuideLine()}
//        </Tag>
//      )
//    }
// }
