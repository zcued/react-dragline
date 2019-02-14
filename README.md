# react-dragline
> Guide lines and magnetic adsorption to better align draggable elements.

[![npm version](https://img.shields.io/npm/v/react-dragline.svg)](https://www.npmjs.com/package/react-dragline)
[![npm downloads](https://img.shields.io/npm/dt/react-dragline.svg)](https://www.npmjs.com/package/react-dragline)
[![license](https://img.shields.io/npm/l/react-dragline.svg)](https://github.com/zcued/react-dragline/blob/master/LICENSE)


 **Examples available here:** [https://zcued.github.io/react-dragline/](https://zcued.github.io/react-dragline/)


### Installation
**npm**
```
npm install react-dragline --save
```
**yarn**
```
yarn add install react-dragline
```
If you aren't using browserify/webpack, a [UMD version of react-dragline](https://github.com/zcued/react-dragline/tree/master/dist) is available. It expects external React and ReactDOM.

### Example
```js
import { DraggableContainer, DraggableChild } from 'react-dragline'


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

### Contributing
1. Fork, then clone the project.
2. Run the project in development mode: `$ yarn start`.
3. Make your changes.
4. Lint the code: `$ yarn lint`
5. Make sure that the tests still pass:`$ yarn test`
6. Commit and PR.
