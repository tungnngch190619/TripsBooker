import React, { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Modal} from "react-bootstrap"
import "./Login.css"
import { useDispatch } from "react-redux";
import * as formik from 'formik';
import * as yup from 'yup';
import { loginUser } from "../../redux/userSlice";
import NotificationModal from "../../components/NotificationModal";

function Login (props) {
    const {tokenExpired} = props
    const [sessionExpiredModal, setSessionExpiredModal] = useState(tokenExpired)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {Formik} = formik
    const addSchema = yup.object().shape({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
    });

    const [notificationModal, setNotificationModal] = useState(false)
    const [notificationBody, setNotificationBody] = useState("")

    const login = async (values) => {
        let {username, password} = values
        console.log("logging in")
        try {
            const res = await axios.post("/api/users/login", {
                username: username,
                password: password,
            })
            if(res.status === 200 ) {
                console.log("logged in")
                let {username, role, token} = res.data
                dispatch(loginUser({username, role, token}))
                navigate("/users")
            }
        } catch (err) {
            if(err.response.status === 400) {
                setNotificationModal(true)
                setNotificationBody(err.response.data.message)
            }
        }
    }
    
    return (
        <div className="screen">
            <div className="login-wrapper">
            <Formik
                validationSchema={addSchema} 
                onSubmit={(values) => login(values)}
                initialValues={{
                    username: "",
                    password: "",
                }}>
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                        <Form className="form" noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik01">
                                <Form.Label className="form-label">Username:</Form.Label>
                                <Form.Control 
                                value={values.username} 
                                name="username"
                                onChange={handleChange} 
                                isInvalid={touched.username && errors.username}
                                type="username" 
                                className="form-input"/>
                                <Form.Control.Feedback type="invalid" tooltip>{errors.username}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex flex-row position-relative"  controlId="validationFormik02">
                                <Form.Label className="form-label">Password:</Form.Label>
                                <Form.Control 
                                value={values.password} 
                                name="password"
                                onChange={handleChange} 
                                isInvalid={touched.password && errors.password}
                                type="password"
                                className="form-input"/>
                                <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex flex-row justify-content-end">
                                <Button variant="primary" type="submit"  className="form-button">
                                    Sign in
                                </Button>
                            </Form.Group>
                        </Form>
                        )
                    }
                </Formik>
            </div>
            <Modal show={sessionExpiredModal} onHide={() => setSessionExpiredModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Session Expired
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your Session has expired, please Sign in again
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSessionExpiredModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <NotificationModal show={notificationModal} setShow={setNotificationModal} body={notificationBody}></NotificationModal>
        </div>
    )
}

export default Login