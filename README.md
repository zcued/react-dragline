# react-drag-guideline
Guide lines to better align draggable children in React.
- [playground](https://zcued.github.io/react-drag-guideline/)

## Usage

### Installation
**npm**
```
npm install react-drag-guideline --save
```
**yarn**
```
yarn add install react-drag-guideline
```

### Example
```js
import { DraggableContainer, DraggableChild } from 'react-drag-guideline'

const Example = () => (
  <DraggableContainer>
      <DraggableChild>
          <div>Hello world</div>
      </DraggableChild>
      <DraggableChild>
          <div>world Hello </div>
      </DraggableChild>
  </DraggableContainer>
)

ReactDOM.render(<Example />, container)
```
### Prop Types
| Property | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| Container | string/element | 'div' ||
| threshold | number | 0 ||
| directions | array | ['tt', 'bb', 'll', 'rr', 'tb', 'lr' ] ||
| activeClassName | string | 'active' ||
| color | string | '#FF00CC' ||


## Development
```
1. npm install
2. npm start
The example will open in browser automatically
```


## TODO
- - [x] 辅助线显示
- - [x] 吸附功能
- - [x] 方向扩展
    1. - [x] 基本方向（上下左右）
    2. - [x] 扩展方向（垂直中线/水平中线）
    3. - [x] 同方向多条辅助线同时显示
    4. - [x] props自定义对齐方向
- - [x] 辅助线优化
    1. - [x] 组件间辅助线
    2. - [x] 对齐元素增加className
- - [x] 初始化及controlled集成
- - [x] 基础props补充
- - [x] 在线DEMO
- - [ ] 完善文档
- - [ ] 单元测试或测试用例
- - [ ] 发布npm包

