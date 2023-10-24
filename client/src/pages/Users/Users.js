import React, { useEffect, useState } from "react"
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as formik from 'formik';
import * as yup from 'yup';
import "./Users.css"
import CustomizedTable from "../../components/CustomizedTable/CustomizedTable";
import WebpageBackground from "../../components/WebpageBackground/WebpageBackground";
import NotificationModal from "../../components/NotificationModal";
import { useDispatch } from "react-redux";
import { handleRequestError } from "../../utils/handleRequestError";

const Users = () => {
    const dispatch = useDispatch()
    const {Formik} = formik
    const addSchema = yup.object().shape({
        username: yup.string().required("Username is required").min(5, "5 to 20 characters").max(20, "5 to 20 characters"),
        password: yup.string().required("Password is required").min(8, "At least 8 characters"),
        fullName: yup.string().required("Fullname is required").max(50, "Fullname < 50"),
        role: yup.string().required().oneOf(["Admin", "Staff"], 'Role must be chosen'),
    });
    const editSchema = yup.object().shape({
        password: yup.string().min(8, "At least 8 characters"),
        fullName: yup.string().required("Fullname is required").max(50, "Fullname < 50"),
        role: yup.string().required().oneOf(["Admin", "Staff"], 'Role must be chosen'),
    });

    const [users, setUsers] = useState([])
    const [reset, setReset] = useState(false)

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [notificationModal, setNotificationModal] = useState(false)

    const [targetId, setTargetId] = useState("")
    const [editUsername, setEditUsername] = useState("")
    const [editPassword, setEditPassword] = useState("")
    const [editFullName, setEditFullname] = useState("")
    const [editRole, setEditRole] = useState("")


    const [notificationTitle, setNotificationTitle] = useState("")
    const [notificationBody, setNotificationBody] = useState("")

    const columns = ["ID", "Username", "Full Name","Active", "Role", "Actions"]

    const createNewUser = async (values) => {
        let {username, password, fullName, role} = values
        try {
            const res = await axios.post("/api/users/register", {
                username: username,
                password: password,
                fullName: fullName.trim(),
                role: role,
            })
            setAddModal(false)
            setReset(!reset)
        } catch (err) {
            if([400, 500].some((errorCode) => errorCode == err.response.status)) {
                setNotificationModal(true)
                setNotificationBody(err.response.data.message)
            }
            handleRequestError(dispatch, err)
        }
    }

    const editUser = async (values) => {
        let {password, fullName, role} = values
        try {
            const res = await axios.post("/api/users/editUser", {
                _id: targetId,
                username: editUsername,
                password: password,
                fullName: fullName,
                role: role,
            })
            setNotificationModal(true)
            setNotificationBody(res.data.message)
            setEditModal(false)
            setReset(!reset)
        } catch (err) {
            console.log(err)
        }
    }
    
    const toggleActive = async (user) => {
        try {
            const res = await axios.post("/api/users/toggleActive", {
                _id: user._id,
                active: user.active,
            })
            setNotificationModal(true)
            setNotificationBody(res.data.message)
            setReset(!reset)
        } catch (err) {
            console.log(err)
            handleRequestError(dispatch, err)
        }
    }

    const resetPassword = async (userId) => {
        try {
            const res = await axios.post("/api/users/reset-password/"+userId)
            if(res.status === 200) {
                setNotificationModal(true)
                setNotificationTitle(res.data.title)
                setNotificationBody(res.data.body)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const onEdit = (user) => {
        if(user) {
            setEditModal(true)
            setTargetId(user._id)
            setEditUsername(user.username)
            setEditPassword("")
            setEditFullname(user.fullName)
            setEditRole(user.role)
        }
    }

    const userOptions = (user) => {
        return (
            <div className="d-flex flex-row">
                <Button variant="warning" className="button me-1" onClick={() => onEdit(user)}>
                    <FontAwesomeIcon icon={"pen-to-square"} className="button-icon"/>
                    Edit
                </Button>
                <Button variant="danger" className="button me-1" onClick={() => resetPassword(user._id)}>
                    <FontAwesomeIcon icon={"key"} className="button-icon"/>
                    Reset
                </Button>
                {user.active===true ? 
                <Button variant="danger" className="button" onClick={() => toggleActive(user)}>
                    <FontAwesomeIcon icon={"lock"} className="button-icon"/>
                    Deactivate
                </Button>
                :
                <Button variant="danger" className="button" onClick={() => toggleActive(user)}>
                    <FontAwesomeIcon icon={"lock-open"} className="button-icon"/>
                    Activate
                </Button>}
            </div>
        )
    }

    const tableTop = () => {
        return (
            <div className="d-flex flex-row justify-content-end">
                <Button onClick={() => setAddModal(true)}>
                    <FontAwesomeIcon icon={"plus"} className="button-icon"/>
                    Add User
                </Button>
            </div>
        )
    }

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await axios.get("/api/users/")
                setUsers(res.data)
            } catch (err) {
                console.log(err)
                handleRequestError(dispatch, err)
            }
        }
        getUsers()
    }, [reset])

    return (
        <WebpageBackground>
            <div className="table-wrapper">

                <CustomizedTable data={users} columns={columns} options={userOptions} tableTop={tableTop}/>

                <Modal show={addModal} onHide={() => setAddModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                        validationSchema={addSchema} 
                        onSubmit={(values) => createNewUser(values)}
                        initialValues={{
                            username: "",
                            password: "",
                            fullName: "",
                            role: "Admin",
                        }}>
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form className="form" noValidate onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik01">
                                        <Form.Label className="form-label">Username:</Form.Label>
                                        <Form.Control 
                                        value={values.username} 
                                        name="username"
                                        onChange={handleChange} 
                                        isValid={touched.username && !errors.username}
                                        isInvalid={touched.username && errors.username}
                                        type="username" 
                                        placeholder="Tên tài khoản" 
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.username}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative"  controlId="validationFormik02">
                                        <Form.Label className="form-label">Password:</Form.Label>
                                        <Form.Control 
                                        value={values.password} 
                                        name="password"
                                        onChange={handleChange} 
                                        isValid={touched.password && !errors.password}
                                        isInvalid={touched.password && errors.password}
                                        type="password" 
                                        placeholder="Mật khẩu" 
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative"  controlId="validationFormik03">
                                        <Form.Label className="form-label">Full name:</Form.Label>
                                        <Form.Control 
                                        value={values.fullName}
                                        name="fullName"
                                        onChange={handleChange}
                                        isValid={touched.fullName && !errors.fullName}
                                        isInvalid={touched.fullName && errors.fullName}
                                        type="text" 
                                        placeholder="Họ và tên" 
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row"  controlId="validationFormik04">
                                        <Form.Label className="form-label">Role:</Form.Label>
                                        <Form.Select 
                                        value={values.role}
                                        name="role"
                                        onChange={handleChange} 
                                        isValid={touched.role && !errors.role}
                                        className="form-input">
                                            <option value="Admin">Admin</option>
                                            <option value="Staff">Staff</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="d-flex flex-row justify-content-end">
                                        <Button variant="primary" type="submit">
                                            Xác nhận
                                        </Button>
                                    </Form.Group>
                                </Form>
                                )
                            }
                        </Formik>
                    </Modal.Body>
                </Modal>

                <Modal show={editModal} onHide={() => setEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Formik
                        validationSchema={editSchema} 
                        onSubmit={(values) => editUser(values)}
                        initialValues={{
                            password: editPassword,
                            fullName: editFullName,
                            role: editRole,
                        }}>
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form className="form" noValidate onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3 d-flex flex-row">
                                        <Form.Label className="form-label">Username: {editUsername}</Form.Label>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative"  controlId="validationFormik02">
                                        <Form.Label className="form-label">Password:</Form.Label>
                                        <Form.Control 
                                        value={values.password} 
                                        name="password"
                                        onChange={handleChange} 
                                        isValid={touched.password && !errors.password}
                                        isInvalid={errors.password}
                                        type="password" 
                                        placeholder="Mật khẩu" 
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative"  controlId="validationFormik03">
                                        <Form.Label className="form-label">Full name:</Form.Label>
                                        <Form.Control 
                                        value={values.fullName}
                                        name="fullName"
                                        onChange={handleChange}
                                        isValid={touched.fullName && !errors.fullName}
                                        isInvalid={errors.fullName}
                                        type="text" 
                                        placeholder="Họ và tên" 
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row"  controlId="validationFormik04">
                                        <Form.Label className="form-label">Role:</Form.Label>
                                        <Form.Select 
                                        value={values.role}
                                        name="role"
                                        onChange={handleChange} 
                                        isValid={touched.role && !errors.role}
                                        className="form-input">
                                            <option value="Admin">Admin</option>
                                            <option value="Staff">Staff</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="d-flex flex-row justify-content-end">
                                        <Button variant="primary" type="submit">
                                            Xác nhận
                                        </Button>
                                    </Form.Group>
                                </Form>
                                )}
                        </Formik>
                    </Modal.Body>
                </Modal>

                <NotificationModal show={notificationModal} setShow={setNotificationModal} title={notificationTitle} body={notificationBody} setTitle={setNotificationTitle} setBody={setNotificationBody}/>

            </div>
        </WebpageBackground>
    )
}

export default Users