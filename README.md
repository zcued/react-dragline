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


# TODO
1. 吸附功能
2. props扩展（direction）
3. 对齐线优化
4. 初始化及controlled集成