/*eslint-disable*/
import './App.css';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { lazy, Suspense, createContext, useState } from 'react';
import data from './data.js';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query' 

// import Detail from './routes/Detail';
// import Cart from './routes/Cart.js';

export let Context1 = createContext();

const Detail = lazy( () => import('./routes/Detail.js') )
const Cart = lazy( () => import('./routes/Cart.js') )

function App() {

  // let obj = { name: 'kim' }
  // localStorage.setItem('data', JSON.stringify(obj))
  // let 꺼낸거 = localStorage.getItem('data')
  // console.log(JSON.parse(꺼낸거).name);

  let [shoes, setShoes] = useState(data);
  let [재고] = useState([10, 11, 12]);
  let navigate = useNavigate();

    let result = useQuery(['작명'], () =>
      axios.get('https://codingapple1.github.io/userdata.json')
        .then((a) => { 
          console.log('요청됨')
          return a.data 
        })
    )

  result.data
  result.isLoading
  result.error

  return (
    <div className="App">


      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">ShoeShop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => { navigate('/') }}>Home</Nav.Link>
            <Nav.Link onClick={() => { navigate('/cart') }}>Cart</Nav.Link>
          </Nav>
          <Nav>
      { result.isLoading && '로딩중' }
      { result.error && '에러남' }
      { result.data && result.data.name }
      </Nav>
        </Container>
      </Navbar>

<Suspense fallback={<div>로딩중임</div>}>
      <Routes>
        <Route path='/' element={
          <>
            <div className="main-bg"></div>
            <div className="container">
              <div className="row">
                {
                  shoes.map((a, i) => {
                    return (
                      <Card shoes={shoes[i]} i={i}></Card>
                    )
                  })
                }
              </div>
            </div>
            <button onClick={() => {
              axios.get('https://codingapple1.github.io/shop/data2.json').then((결과) => {
                let copy = [...shoes, ...결과.data]
                setShoes(copy)
              })
                .catch(() => {
                  console.log('실패함')
                })
            }}>버튼</button>
          </>
        } />
        <Route path='/detail/:id' element={
          <Context1.Provider value={{ 재고, shoes }}>
            <Detail shoes={shoes} /></Context1.Provider>} />
        <Route path='/about' element={<About />}>
          <Route path='member' element={<div>멤버임</div>} />
          <Route path='location' element={<div>위치정보임</div>} />
        </Route>
        <Route path='/event' element={<div>오늘의이벤트 <Outlet></Outlet></div>}>
          <Route path='one' element={<div>첫 주문시 양배추즙 서비스</div>} />
          <Route path='two' element={<div>생일기념 쿠폰받기</div>} />
        </Route>
        <Route path='*' element={<div>없는페이지요</div>} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
      </Suspense>
    </div>
  );
}

function About() {
  return (
    <div>
      <h4>회사정보임</h4>
      <Outlet></Outlet>
    </div>
  )
}

function Card(props) {
  return (
    <div className="col-md-4">
      <img src={'https://codingapple1.github.io/shop/shoes' + (props.i + 1) + '.jpg'} width="80%" />
      <h4>{props.shoes.title}</h4>
      <p>{props.shoes.price}</p>
    </div>
  )
}


export default App;