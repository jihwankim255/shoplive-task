import './App.css'
import React, { useState, useRef, useEffect } from 'react'

function App() {
  const [box1State, setBox1State] = useState('READY')
  const [box1Current, setBox1Current] = useState(0)
  const [box2State, setBox2State] = useState('READY')
  const [box2Current, setBox2Current] = useState(0)
  const wrapperRef = useRef(null)
  const wrapperRef2 = useRef(null)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBox1State('AUTO TRANSITION')
      setTransform(
        { target: wrapperRef.current.children[1] },
        wrapperRef.current.children[1].offsetWidth,
        500
      )
      setTimeout(() => {
        wrapperRef.current.children[1].style.transform = `translate3d(0px, 0, 0)`
        wrapperRef.current.children[1].style.opacity = `1`
        wrapperRef.current.children[1].style.transition = ''
        setBox1Current((prev) => prev + 1)
      }, 600)
    }, 3000)
    const intervalId2 = setInterval(() => {
      setBox2State('AUTO TRANSITION')
      setTransform(
        { target: wrapperRef2.current.children[1] },
        wrapperRef2.current.children[1].offsetWidth,
        500
      )
      setTimeout(() => {
        wrapperRef2.current.children[1].style.transform = `translate3d(0px, 0, 0)`
        wrapperRef2.current.children[1].style.opacity = `1`
        wrapperRef2.current.children[1].style.transition = ''
        setBox2Current((prev) => prev + 1)
      }, 600)
    }, 3000)
    return () => {
      clearInterval(intervalId)
      clearInterval(intervalId2)
    }
  }, [])
  let startX = 0,
    startY = 0,
    moveX = 0,
    moveY = 0,
    direction = '',
    swipeTime = 0,
    box = ''
  function handlePointerDown(e) {
    startX = e.clientX
    startY = e.cleintY
    swipeTime = Date.now()
    box = e.target.className
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
    e.target.addEventListener('pointerleave', handlePointerLeave)
  }
  function handlePointerMove(e) {
    moveX = e.clientX - startX
    moveY = e.clientY - startY
    if (direction === '' && moveX > 0) {
      direction = 'right'
    } else if (direction === '' && moveX < 0) {
      direction = 'left'
    }
    if (box === 'box1') {
      setBox1State(`SWIPE ${direction}`)
      setTransform({ target: wrapperRef.current.children[1] }, moveX)
    } else {
      setBox2State(`SWIPE ${direction}`)
      setTransform({ target: wrapperRef2.current.children[1] }, moveX)
    }
  }
  function setTransform(e, x, duration) {
    if (duration)
      e.target.style.transition = `transform ${duration}ms, opacity ${duration}ms`
    let opacity = (e.target.offsetWidth - Math.abs(x)) / e.target.offsetWidth
    e.target.style.opacity = `${opacity}`
    if (direction === 'right' && x < 0) return
    if (direction === 'left' && x > 0) return
    e.target.style.transform = `translate3d(${x}px, 0, 0)`
  }
  function handlePointerUp(e) {
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
    e.target.removeEventListener('pointerleave', handlePointerLeave)
    let target = {}
    if (box === 'box1') target = wrapperRef.current.children[1]
    else target = wrapperRef2.current.children[1]
    if (moveX === 0 && moveY === 0 && Date.now() - swipeTime < 1000) {
      alert('CLICK : ' + e.target.innerText)
    }
    if (moveX / (Date.now() - swipeTime) > 0.4) {
      if (box === 'box1') {
        setBox1State(`FLIP ${direction}`)
      } else {
        setBox2State(`FLIP ${direction}`)
      }
      setTransform(
        { target: target },
        (Math.abs(moveX) / moveX) * target.offsetWidth,
        500
      )
      setTimeout(() => {
        target.style.transform = `translate3d(0px, 0, 0)`
        target.style.opacity = `1`
        target.style.transition = ''
        direction = ''
        box = ''
        if (box === 'box1') setBox1Current((prev) => prev + 1)
        else setBox2Current((prev) => prev + 1)
      }, 600)
      return
    }
    if (Math.abs(moveX) < target.offsetWidth / 2) {
      setTransform({ target: target }, 0, 400)
      setTimeout(() => (target.style.transition = ''), 100)
    } else {
      if (box === 'box1') setBox1State(`TO ${direction}`)
      else setBox2State(`TO ${direction}`)
      setTransform(
        { target: target },
        (Math.abs(moveX) / moveX) * target.offsetWidth,
        500
      )
      setTimeout(() => {
        target.style.transform = `translate3d(0px, 0, 0)`
        target.style.opacity = `1`
        target.style.transition = ''
        if (box === 'box1') setBox1Current((prev) => prev + 1)
        else setBox2Current((prev) => prev + 1)
      }, 600)
    }
    direction = ''
    box = ''
  }
  function handlePointerLeave(e) {
    console.log('handle pointer leave', e.target)
  }

  const firstItems = ['red', 'orange', 'green', 'blue']
  const secondItems = ['indigo', 'purple']

  return (
    <div className="App">
      <h1>Task</h1>
      <div>{box1State}</div>
      <div className="wrapper" ref={wrapperRef}>
        <div
          className="box1 next"
          style={{ backgroundColor: firstItems[(box1Current + 1) % 4] }}
        >
          {firstItems[(box1Current + 1) % 4]}
        </div>
        <div
          className="box1"
          onPointerDown={handlePointerDown}
          style={{ backgroundColor: firstItems[box1Current % 4] }}
        >
          {firstItems[box1Current % 4]}
        </div>
      </div>
      <div>["red", "orange", "green", "blue"]</div>
      <br />
      <br />
      <div>{box2State}</div>
      <div className="wrapper2" ref={wrapperRef2}>
        <div
          className="box2 next"
          style={{ backgroundColor: secondItems[(box2Current + 1) % 2] }}
        >
          {secondItems[(box2Current + 1) % 2]}
        </div>
        <div
          className="box2"
          onPointerDown={handlePointerDown}
          style={{ backgroundColor: secondItems[box2Current % 2] }}
        >
          {secondItems[box2Current % 2]}
        </div>
      </div>
      <div>["indigo", "purple"]</div>
    </div>
  )
}

export default App
