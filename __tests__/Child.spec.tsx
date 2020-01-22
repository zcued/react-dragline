import * as React from "react"
import { mount } from "enzyme"
import { DraggableChild } from '../src/index'
import { DraggableEvent, DraggableData } from 'react-draggable'

it('handleEvent been call', () => {
    const onStart = jest.fn()
    const onDrag = jest.fn()
    const onStop = jest.fn()

    const wrapper = mount(
      <DraggableChild
        key="a"
        onStart={onStart}
        onDrag={onDrag}
        onStop={onStop}
        // @ts-ignore
        _start={() => {}}
        _drag={() => ({x: 0, y: 0})}
        _stop={() => {}}
      >
        <span className="child" />
      </DraggableChild>
    )
  
    const instance = wrapper.instance() as DraggableChild
  
    instance.handleStart({} as DraggableEvent, {} as DraggableData)
    expect(onStart).toHaveBeenCalled()

    instance.handleDrag({} as DraggableEvent, {} as DraggableData)
    expect(onDrag).toHaveBeenCalled()

    instance.handleStop({} as DraggableEvent, {} as DraggableData)
    expect(onStop).toHaveBeenCalled()
  })