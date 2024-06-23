import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Error from './pages/error'
import Home from './pages/home'
import Product from './pages/product'
import backgroundImage from './assets/ss.jpg'

const App = () => {
  const divStyle = {
    backgroundImage: `url(${backgroundImage})`,
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div style={divStyle}>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/products' element={<Product />}></Route>
        <Route path='*' element={<Error />}></Route>
      </Routes>
      </div>
  )
}
export default App
