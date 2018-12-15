# react-drag-guideline
> Guide lines to better align draggable children in React.

[![npm version](https://img.shields.io/npm/v/react-drag-guideline.svg)](https://www.npmjs.com/package/react-drag-guideline)
[![npm downloads](https://img.shields.io/npm/dt/react-drag-guideline.svg)](https://www.npmjs.com/package/react-drag-guideline)
[![license](https://img.shields.io/npm/l/react-drag-guideline.svg)](https://github.com/zcued/react-drag-guideline/blob/master/LICENSE)


 **Examples available here:** [https://zcued.github.io/react-drag-guideline/](https://zcued.github.io/react-drag-guideline/)


### Installation
**npm**
```
npm install react-drag-guideline --save
```
**yarn**
```
yarn add install react-drag-guideline
```
If you aren't using browserify/webpack, a [UMD version of react-drag-guideline](https://github.com/zcued/react-drag-guideline/tree/master/dist) is available. It expects external React and ReactDOM.

### Example
```js
import { DraggableContainer, DraggableChild } from 'react-drag-guideline'


class Example extends React.Component {
  state = [
    { id: 1, position: {x: 100, y: 10} },
    { id: 2, position: {x: 400, y: 200} },
  ]

  render() {
    const containerStyle = {
      height: 600,
      position: 'relative',
    }

    return (
      <DraggableContainer style={containerStyle}>
        {
          this.state.children.map(({ id, position }, index) => {
            const style = {
              width: 100,
              height: 100,
              cursor: 'move',
              background: '#8ce8df',
            }

            return (
              <DraggableChild key={id} defaultPosition={position}>
                <div style={style} />
              </DraggableChild>
            )
          })
        }
      </DraggableContainer>
    )
  }
}

ReactDOM.render(<Example />, container)
```

### Prop Types
| Property | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| Container | String/Element | 'div' | The `DraggableContainer` will be rendered as a HTML tag or the React Component you specify |
| threshold | Number | 5 | The max distance of between others and the dragging element triggering magnetic adsorption |
| directions | Array | ['tt', 'bb', 'll', 'rr', 'tb', 'lr' ] | The directions you want. `tt` indicate the guide line will show when a element aligned with the top of the dragging element. |
| activeClassName | String | 'active' | if you want to add class name for the element aligned with one you drag, use it.|
| lineStyle | Object | {} | You can customize the style of auxiliary line by this option |
| limit | String | true | Whether to restricts movement within the container |

### Development
```
1. npm install
2. npm start
The example will open in browser automatically
```
