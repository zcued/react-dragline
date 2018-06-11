# react-drag-guideline
Guide lines to better align draggable children in React.

# Usage
```js
import { DraggableContainer, DraggableChild } from 'react-drag-guideline'

const Demo = () => (
  <DraggableContainer>
      <DraggableChild>
          <div>Hello world</div>
      </DraggableChild>
      <DraggableChild>
          <div>world Hello </div>
      </DraggableChild>
  </DraggableContainer>
)

ReactDOM.render(<Demo />, container)
```

# Development
```
1. npm install
2. npm start
The example will open in browser automatically
```
