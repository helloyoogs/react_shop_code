/*eslint-disable*/
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from './../store.js'
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'


import { Context1 } from './../App.js'

function Detail(props) {
    let dispatch = useDispatch()

    let { 재고 } = useContext(Context1)

    let { id } = useParams();
    let 찾은상품 = props.shoes.find(function (x) { return x.id == id });
    let [alert1, setAlert] = useState(true);
    let [anidetail, setAniDetail] = useState('')
    let [num, setNum] = useState('')
    let [탭, 탭변경] = useState(0)

    /*최근 본 상품 localStorage로 만들기 */
    useEffect(() => {
        let 꺼낸거 = localStorage.getItem('watched')
        꺼낸거 = JSON.parse(꺼낸거)
        꺼낸거.push(찾은상품.id)
        //Set으로 바꿨다가 다시 array로 만들기
        꺼낸거 = new Set(꺼낸거)
        꺼낸거 = Array.from(꺼낸거)
        localStorage.setItem('watched', JSON.stringify(꺼낸거))
    }, [])
    useEffect(() => {
        let a = setTimeout(() => { setAlert(false) }, 2000)
        return () => {
            clearTimeout(a)
        }
    }, [])
    useEffect(() => {
        setTimeout(() => { setAniDetail('end_d') }, 100)
        return () => {
            setAniDetail('')
        }
    }, [])
    useEffect(() => {
        if (isNaN(num) == true) {
            alert('그러지마세요')
        }

    }, [num])

    return (

        <div className={'container start_d ' + anidetail}>
            {
                alert1 == true
                    ? <div className="alert alert-warning">
                        2초이내 구매시 할인
                    </div>
                    : null
            }
            {재고}
            <div className="row mb-5">
                <div className="col-md-6">
                    <img src={찾은상품.img} width="100%" />
                </div>
                <div className="col-md-6">
                    <input onChange={(e) => { setNum(e.target.value) }} />
                    <h4 className="pt-5">{찾은상품.title}</h4>
                    <p>{찾은상품.content}</p>
                    <p>{찾은상품.price}원</p>
                    <button className="btn btn-danger" onClick={() => {
                        dispatch(addItem({ id: 찾은상품.id, name: 찾은상품.title, count: 찾은상품.count }))
                    }}>주문하기</button>
                </div>
            </div>
            <Link to="/cart">
                Cart
            </Link>
            <Nav variant="tabs" defaultActiveKey="link0">
                <Nav.Item>
                    <Nav.Link onClick={() => { 탭변경(0) }} eventKey="link0">버튼0</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={() => { 탭변경(1) }} eventKey="link1">버튼1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={() => { 탭변경(2) }} eventKey="link2">버튼2</Nav.Link>
                </Nav.Item>
            </Nav>
            <TabContent 탭={탭} shoes={props.shoes} />
        </div>
    )
}
function TabContent({ 탭, shoes }) {

    let { 재고 } = useContext(Context1)
    let [fade, setFade] = useState('')
    useEffect(() => {
        setTimeout(() => { setFade('end') }, 100)
        return () => {
            setFade('')
        }
    }, [탭])
    return (
        <div className={'start ' + fade}>
            {[<div>{shoes[0].title}</div>, <div>내용1</div>, <div>내용2</div>][탭]}
        </div>
    )
}
export default Detail;

