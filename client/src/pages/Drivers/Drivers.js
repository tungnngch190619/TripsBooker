import axios from "axios";
import * as formik from 'formik';
import * as yup from 'yup';
import React, { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Drivers.css"
import CustomizedTable from "../../components/CustomizedTable/CustomizedTable";
import WebpageBackground from "../../components/WebpageBackground/WebpageBackground";
import NotificationModal from "../../components/NotificationModal";
import { useDispatch } from "react-redux";
import { handleRequestError } from "../../utils/handleRequestError";

const Drivers = () => {
    const dispatch = useDispatch()
    const {Formik} = formik
    const addSchema = yup.object().shape({
        fullName: yup.string().required("Full Name is required").max(50, "50 characters maximum"),
        phone: yup.number("Invalid phone number").required("Phone number is required"),
        shift: yup.string().oneOf(["Day", "Night"]),
    });
    const editSchema = yup.object().shape({
        fullName: yup.string().required("Full Name is required").max(50, "50 characters maximum"),
        phone: yup.number("Invalid phone number").required("Phone number is required"),
        shift: yup.string().oneOf(["Day", "Night"]),
    });

    const [drivers, setDrivers] = useState([])
    const [reset, setReset] = useState(false)

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [notificationModal, setNotificationModal] = useState(false)

    const [targetId, setTargetId] = useState("")
    const [editFullName, setEditFullname] = useState("")
    const [editPhone, setEditPhone] = useState(null)
    const [editShift, setEdiShift] = useState("Day")


    const [notificationTitle, setNotificationTitle] = useState("")
    const [notificationBody, setNotificationBody] = useState("")

    const columns = ["ID", "Full Name", "Phone", "Shift"]

    const createNewDriver = async (values) => {
        let {fullName, phone, shift} = values
        try {
            const res = await axios.post("/api/drivers/", {
                fullName: fullName,
                phone: phone,
                shift: shift,
            })
            setNotificationModal(true)
            setNotificationBody(res.data.message)
            setAddModal(false)
            setReset(!reset)
        } catch (err) {
            console.log(err)
            handleRequestError(dispatch, err)
        }
    }

    const editDriver = async (values) => {
        let {fullName, phone, shift} = values
        try {
            const res = await axios.put("/api/drivers/"+ targetId, {
                fullName: fullName,
                phone: phone,
                shift: shift,
            })
            setNotificationModal(true)
            setNotificationBody(res.data.message)
            setEditModal(false)
            setReset(!reset)
        } catch (err) {
            console.log(err)
            handleRequestError(dispatch, err)
        }
    }

    const deleteDriver = async (_id) => {
        try {
            const res = await axios.delete("/api/drivers/" + _id)
            setNotificationModal(true)
            setNotificationBody(res.data.message)
            setReset(!reset)
        } catch (err) {
            console.log(err)
            handleRequestError(dispatch, err)
        }
    }

    const onEdit = (driver) => {
        if(driver) {
            setEditModal(true)
            setTargetId(driver._id)
            setEditFullname(driver.fullName)
            setEditPhone(driver.phone)
            setEdiShift(driver.shift)
        }
    }

    const driverOptions = (driver) => {
        return (
            <div className="d-flex flex-row">
                <Button variant="warning" className="button me-1" onClick={() => onEdit(driver)}>
                    <FontAwesomeIcon icon={"pen-to-square"} className="button-icon"/>
                    Edit
                </Button>
                <Button variant="danger" className="button me-1" onClick={() => deleteDriver(driver._id)}>
                    <FontAwesomeIcon icon={"trash"} className="button-icon"/>
                    Delete
                </Button>
            </div>
        )
    }

    const tableTop = () => {
        return (
            <div className="d-flex flex-row justify-content-end">
                <Button onClick={() => setAddModal(true)}>
                    <FontAwesomeIcon icon={"plus"} className="button-icon"/>
                    Add Driver
                </Button>
            </div>
        )
    }

    const resetEditModal = () => {
        setEditModal(false)
    }
    
    useEffect(() => {
        const getDrivers = async () => {
            try {
                const res = await axios.get("/api/drivers/")
                setDrivers(res.data)
                console.log("drivers fetched")
            } catch (err) {
                console.log(err)
                handleRequestError(dispatch, err)
            }
        }
        getDrivers()
    }, [reset])

    return (
        <WebpageBackground>
            <div className="table-wrapper">

                <CustomizedTable data={drivers} columns={columns} options={driverOptions} tableTop={tableTop}/>

                <Modal show={addModal} onHide={() => setAddModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Driver</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                        validationSchema={addSchema} 
                        onSubmit={(values) => createNewDriver(values)}
                        initialValues={{
                            fullName: "",
                            phone: "",
                            shift: "Day",
                        }}>
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form className="form" noValidate onSubmit={(handleSubmit)}>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik02">
                                        <Form.Label className="form-label">Full name:</Form.Label>
                                        <Form.Control 
                                        value={values.fullName}
                                        name="fullName"
                                        onChange={handleChange}
                                        isValid={touched.fullName && !errors.fullName}
                                        isInvalid={errors.fullName}
                                        type="text" 
                                        placeholder="Le Van A" 
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik03">
                                        <Form.Label className="form-label">Phone Number:</Form.Label>
                                        <Form.Control 
                                        value={values.phone} 
                                        name="phone"
                                        onChange={handleChange} 
                                        isValid={touched.phone && !errors.phone}
                                        isInvalid={errors.phone}
                                        type="text"
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.phone}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row" controlId="validationFormik04">
                                        <Form.Label className="form-label">Shift:</Form.Label>
                                        <Form.Select 
                                        value={values.shift}
                                        name="shift"
                                        onChange={handleChange} 
                                        isValid={touched.shift && !errors.shift}
                                        className="form-input">
                                            <option value="Day">Day</option>
                                            <option value="Night">Night</option>
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

                <Modal show={editModal} onHide={() => resetEditModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Driver</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Formik
                        validationSchema={editSchema} 
                        onSubmit={(values) => editDriver(values)}
                        initialValues={{
                            fullName: editFullName,
                            phone: editPhone,
                            shift: editShift,
                        }}>
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form className="form" noValidate onSubmit={(handleSubmit)}>
                                    <Form.Group className="mb-3 d-flex flex-row">
                                        <Form.Label className="form-label">Driver ID: {targetId}</Form.Label>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik02">
                                        <Form.Label className="form-label">Full name:</Form.Label>
                                        <Form.Control 
                                        value={values.fullName}
                                        name="fullName"
                                        onChange={handleChange}
                                        isValid={touched.fullName && !errors.fullName}
                                        isInvalid={errors.fullName}
                                        type="text" 
                                        placeholder="Le Van A" 
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik03">
                                        <Form.Label className="form-label">Phone Number:</Form.Label>
                                        <Form.Control 
                                        value={values.phone} 
                                        name="phone"
                                        onChange={handleChange} 
                                        isValid={touched.phone && !errors.phone}
                                        isInvalid={errors.phone}
                                        type="text"
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.phone}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row" controlId="validationFormik04">
                                        <Form.Label className="form-label">Shift:</Form.Label>
                                        <Form.Select 
                                        value={values.shift}
                                        name="shift"
                                        onChange={handleChange} 
                                        isValid={touched.shift && !errors.shift}
                                        className="form-input">
                                            <option value="Day">Day</option>
                                            <option value="Night">Night</option>
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

export default Drivers