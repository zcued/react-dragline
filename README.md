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
- - [x] 辅助线显示
- - [x] 吸附功能
- - [ ] 方向扩展
    1. - [x] 基本方向（上下左右）
    2. - [ ] 扩展方向（垂直中线/水平中线）
    3. - [ ] props自定义对齐方向
- - [ ] 辅助线优化
    1. - [ ] 组件间辅助线
    2. - [ ] 对齐元素增加className
- - [x] 初始化及controlled集成
- - [ ] 基础props补充