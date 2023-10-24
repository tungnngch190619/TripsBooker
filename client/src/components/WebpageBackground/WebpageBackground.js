import React from "react"
import "./WebpageBackground.css"
import { Button, Container, Dropdown, Form, Image, Nav, Navbar } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from "../../redux/userSlice"

function WebpageBackground ({ children }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const username = useSelector((state) => state.user.username)

    const logout = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("/api/users/logout", {})
            if(res.status === 200 ) {
                console.log(res.data.message)
                dispatch(logoutUser())
            }
            navigate("/login")
        } catch (err) {
            console.log(err)
        }
    }
    
return (
    <div className="d-flex flex-horizontal screen">
        <Navbar className="navbar">
            <Navbar.Brand href="/" className="navbar-header d-flex">
                <Image src="pepe.jpg" rounded style={{width: "3rem"}}/>
                <div className="text-light align-self-center fw-semibold">Trip Booker</div>
            </Navbar.Brand>
            <hr className="divider"/>
            <Nav className="navbar-body">
                <Container className="p-3 navbar-body-inner">
                    <div className="text-secondary fw-semibold d-flex justify-content-center">
                        <div>Management</div>
                    </div>
                    <hr className="divider-dark"/>
                    <Nav.Link onClick={() => navigate("/users")} className="navbar-item">
                        <div className="text-black">Users</div>
                    </Nav.Link>
                    <Nav.Link onClick={() => navigate("/drivers")} className="navbar-item">
                        <div className="text-black">Drivers</div>
                    </Nav.Link>
                    <Nav.Link onClick={() => navigate("/lines")} className="navbar-item">
                        <div className="text-black">Lines</div>
                    </Nav.Link>
                </Container>
            </Nav>
        </Navbar>
        <div id="content-wrapper">
            <div id="navbar-top" className="bg-body-tertiary">
                <Form inline className="d-flex full-width">
                    <Form.Control
                    id="search-input"
                    type="text"
                    placeholder="Tìm kiếm..."
                    className=" mr-sm-2"
                    />
                    <Button id="search-button" type="submit">
                        <FontAwesomeIcon icon="magnifying-glass" />
                    </Button>
                </Form>
                <Container id="navbar-top-right" className="p-0">
                    <Dropdown>
                        <Dropdown.Toggle className="d-flex justify-content-center align-items-center">
                            <div id="navbar-username">{username}</div>
                            <Image src="pepe.jpg" className="img-profile rounded-circle profile-picture"/>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </div>
            <div>
                {children}
            </div>
        </div>
    </div>
)
}
export default WebpageBackground