import axios from "axios";
import * as formik from 'formik';
import * as yup from 'yup';
import React, { useEffect, useState } from "react"
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomizedTable from "../../components/CustomizedTable/CustomizedTable";
import WebpageBackground from "../../components/WebpageBackground/WebpageBackground";
import NotificationModal from "../../components/NotificationModal";
import { useDispatch } from "react-redux";
import { handleRequestError } from "../../utils/handleRequestError";
import "./Lines.css"
import CheckboxList from "../../components/CheckboxList/CheckboxList";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const Lines = () => {
    const dispatch = useDispatch()
    const {Formik} = formik
    
    const locations = ["Hà Nội", "Hải Phòng", "Hạ Long", "Bắc Ninh", "Hải Dương"]
    const frequencies = ["15'", "30'", "1h", "2h", "3h", "4h", "5h"]
    const busTypes = ["Mini-Bus", "Bus"]

    const addSchema = yup.object().shape({
        departure: yup.string().required("Departure is required").oneOf(locations),
        arrival: yup.string().required("Arrival is required").oneOf(locations),
        frequency: yup.string().required("Frequency is required").oneOf(frequencies),
        busType: yup.string().required("Bus Type is required").oneOf(busTypes),
        numberOfSeat: yup.number("Must be a numeric").required("Number of seats is required"),
        plateNumber: yup.string(),
        price: yup.number("Must be a numeric").required("Ticket price is required"),
    });

    const [lines, setLines] = useState([])
    const [drivers, setDrivers] = useState([])
    const [selectedDrivers, setSelectedDrivers] = useState([])
    const [remainingDrivers, setRemainingDrivers] = useState([])

    const [reset, setReset] = useState(false)
    const [isSelectOptionsLoaded, setIsSelectOptionsLoaded] = useState(false)
    const [driversFetched, setDriversFetched] = useState(false)
    const [putIntoRemaining, setPutIntoRemaining] = useState(false)

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [notificationModal, setNotificationModal] = useState(false)
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false)
    const [driversOptionsExpanded, setDriversOptionsExpandeded] = useState(false)

    const [editItem, setEditItem] = useState(null)
    const [deleteItem, setDeleteItem] = useState(null)

    const [notificationTitle, setNotificationTitle] = useState("")
    const [notificationBody, setNotificationBody] = useState("")

    const columns = ["ID", "Departure", "Arrival", "Frequency", "Vehicle type", "Seats", "Plate Number", "Price",]

    const createNewLine = async (values) => {
        let {
            departure,
            arrival,
            frequency,
            busType,
            numberOfSeat,
            plateNumber,
            price} = values
        let driverIds = []
        selectedDrivers.map((d) => driverIds.push(d._id))
        try {
            const res = await axios.post("/api/lines/", {
                departure: departure,
                arrival: arrival,
                frequency: frequency,
                busType: busType,
                numberOfSeat: numberOfSeat,
                plateNumber: plateNumber,
                price: price,
                driverIds: driverIds,
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

    const editLine = async (values) => {
        let {
            departure,
            arrival,
            frequency,
            busType,
            numberOfSeat,
            plateNumber,
            price} = values
        let driverIds = []
        selectedDrivers.map((d) => driverIds.push(d._id))
        try {
            const res = await axios.put("/api/lines/"+ editItem._id, {
                departure: departure,
                arrival: arrival,
                frequency: frequency,
                busType: busType,
                numberOfSeat: numberOfSeat,
                plateNumber: plateNumber,
                price: price,
                driverIds: driverIds,
            })
            setNotificationModal(true)
            setNotificationBody(res.data.message)
            setEditModal(false)
            setReset(!reset)
        } catch (err) {
            console.log(err)
        }
    }

    const deleteLine = async (_id) => {
        console.log("deleting")
        try {
            const res = await axios.delete("/api/lines/" + _id)
            setDeleteConfirmationModal(false)
            setNotificationModal(true)
            setNotificationBody(res.data.message)
            setReset(!reset)
        } catch (err) {
            console.log(err)
        }
    }

    const onAdd = () => {
        setAddModal(true)
        getDrivers()
        setPutIntoRemaining(true)
    }

    const onEdit = async (lineId) => {
        setEditModal(true)
        await getOneLine(lineId)
    }

    const onDelete = (line) => {
        setDeleteItem(line)
        setDeleteConfirmationModal(true)
    }

    const linesOptions = (line) => {
        return (
            <div className="d-flex flex-row">
                <Button variant="warning" className="button me-1" onClick={() => onEdit(line._id)}>
                    <FontAwesomeIcon icon={"pen-to-square"} className="button-icon"/>
                    Edit
                </Button>
                <Button variant="danger" className="button me-1" onClick={() => onDelete(line)}>
                    <FontAwesomeIcon icon={"trash"} className="button-icon"/>
                    Delete
                </Button>
            </div>
        )
    }

    const tableTop = () => {
        return (
            <div className="d-flex flex-row justify-content-end">
                <Button onClick={() => onAdd()}>
                    <FontAwesomeIcon icon={"plus"} className="button-icon"/>
                    Add Lines
                </Button>
            </div>
        )
    }

    const UnselectedItem = (props) => {
        const {item} = props
        return (
            <div className="mt-2 d-flex align-items-center checkbox-button-unchecked" onClick={() => onChecked(item)}>
                <FontAwesomeIcon icon={"fa-regular fa-square"} className="me-2 ms-2"/>
                {item.fullName}, {"ID: " + item._id}
            </div>
        )
    }

    const SelectedItem = (props) => {
        const {item} = props
        return (
            <div className="mt-2 d-flex align-items-center checkbox-button-checked" onClick={() => onUnchecked(item)}>
                <FontAwesomeIcon icon={"fa-regular fa-square-check"} className="me-2 ms-2"/>
                {item.fullName}, {"ID: " + item._id}
            </div>
        )
    }

    const onChecked = (item) => {
        setSelectedDrivers([...selectedDrivers, item].sort((a,b) => a._id - b._id))
        let filtered = remainingDrivers.filter((d) => d._id !== item._id).sort((a,b) => a._id - b._id)
        setRemainingDrivers(filtered)
    }

    const onUnchecked = (item) => {
        setRemainingDrivers([...remainingDrivers, item].sort((a,b) => a._id - b._id))
        let filtered = selectedDrivers.filter((d) => d._id !== item._id).sort((a,b) => a._id - b._id)
        setSelectedDrivers(filtered)
    }

    const onHideAddModal = () => {
        setAddModal(false)
        setSelectedDrivers([])
        setDrivers([])
        setDriversOptionsExpandeded(false)
    }

    const onHideEditModal = () => {
        setEditModal(false)
        setSelectedDrivers([])
        setEditItem(null)
        setDrivers([])
        setDriversOptionsExpandeded(false)
    }

    const getDrivers = async () => {
        setIsSelectOptionsLoaded(false)
        try {
            await axios.get("/api/drivers/")
            .then((res) => {
                setDrivers(res.data)
                console.log("drivers fetched")
                setIsSelectOptionsLoaded(true)
            })
        } catch (err) {
            console.log(err)
            handleRequestError(dispatch, err)
        }
    }

    const getOneLine = async (lineId) => {
        try {
            await axios.get("/api/lines/" + lineId)
            .then((res) => {
                setEditItem(res.data)
                console.log("Edit line fetched")
            })
        } catch (err) {
            console.log(err)
            handleRequestError(dispatch, err)
        }
    }
    
    useEffect(() => {
        const getLines = async () => {
            try {
                const res = await axios.get("/api/lines/getAllLinesWithoutRefs")
                setLines(res.data)
                console.log("lines fetched")
            } catch (err) {
                console.log(err)
                handleRequestError(dispatch, err)
            }
        }
        getLines()
    }, [reset])

    useEffect(() => {
        if(editItem!==null) {
            setSelectedDrivers(editItem.drivers)
            getDrivers()
            setDriversFetched(true)
        }
    }, [editItem])

    useEffect(() => {
        if(addModal!==true && driversFetched!==false && drivers.length!==0) {
            console.log(selectedDrivers)
            console.log(drivers)
            const filtered = drivers.filter((driver) => !selectedDrivers.some((selectedDriver) => selectedDriver._id === driver._id))
            console.log(filtered)
            // setDrivers(filtered)
            setRemainingDrivers(filtered)
            setDriversFetched(false)
        }
    }, [driversFetched, drivers])

    useEffect(() => {
        if(isSelectOptionsLoaded===true && drivers?.length!==0 && putIntoRemaining===true) {
            setRemainingDrivers(drivers)
            setPutIntoRemaining(false)
        }
    }, [isSelectOptionsLoaded, putIntoRemaining])

    return (
        <WebpageBackground>
            <div className="table-wrapper">

                <CustomizedTable data={lines} columns={columns} options={linesOptions} tableTop={tableTop}/>

                <Modal show={addModal} onHide={() => onHideAddModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Line</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                        validationSchema={addSchema} 
                        onSubmit={(values) => createNewLine(values)}
                        initialValues={{
                            departure: "",
                            arrival: "",
                            frequency: "",
                            busType: "",
                            numberOfSeat: "",
                            plateNumber: "",
                            price: "",
                        }}>
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form className="form" noValidate onSubmit={(handleSubmit)}>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik01">
                                        <Form.Label className="form-label">Departure:</Form.Label>
                                        <Form.Select 
                                        value={values.departure}
                                        name="departure"
                                        onChange={handleChange}
                                        isInvalid={touched.departure && errors.departure}
                                        type="text"
                                        className="form-input">
                                            <option value="">Choose place of departure</option>
                                            {locations.map(l => <option value={l}>{l}</option>)}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.departure}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik02">
                                        <Form.Label className="form-label">Arrival:</Form.Label>
                                        <Form.Select 
                                        value={values.arrival}
                                        name="arrival"
                                        onChange={handleChange}
                                        isInvalid={touched.arrival && errors.arrival}
                                        type="text"
                                        className="form-input">
                                            <option value="">Choose place of arrival</option>
                                            {locations.map(l => <option value={l}>{l}</option>)}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.arrival}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik03">
                                        <Form.Label className="form-label">Frequency:</Form.Label>
                                        <Form.Select 
                                        value={values.frequency}
                                        name="frequency"
                                        onChange={handleChange}
                                        isInvalid={touched.frequency && errors.frequency}
                                        type="text"
                                        className="form-input">
                                            <option value="">Choose frequency</option>
                                            {frequencies.map(f => <option value={f}>{f}</option>)}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.frequency}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik04">
                                        <Form.Label className="form-label">Bus Type:</Form.Label>
                                        <Form.Select 
                                        value={values.busType}
                                        name="busType"
                                        onChange={handleChange}
                                        isInvalid={touched.busType && errors.busType}
                                        type="text"
                                        className="form-input">
                                            <option value="">Choose bus type</option>
                                            {busTypes.map(b => <option value={b}>{b}</option>)}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.busType}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik05">
                                        <Form.Label className="form-label">Number of seats:</Form.Label>
                                        <Form.Control 
                                        value={values.numberOfSeat} 
                                        name="numberOfSeat"
                                        onChange={handleChange} 
                                        isValid={touched.numberOfSeat && !errors.numberOfSeat}
                                        isInvalid={touched.numberOfSeat && errors.numberOfSeat}
                                        type="text"
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.numberOfSeat}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik06">
                                        <Form.Label className="form-label">Plate Number:</Form.Label>
                                        <Form.Control 
                                        value={values.plateNumber} 
                                        name="plateNumber"
                                        onChange={handleChange} 
                                        isValid={touched.plateNumber && !errors.plateNumber}
                                        isInvalid={touched.plateNumber && errors.plateNumber}
                                        type="text"
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.plateNumber}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik07">
                                        <Form.Label className="form-label">Price:</Form.Label>
                                        <Form.Control 
                                        value={values.price} 
                                        name="price"
                                        onChange={handleChange} 
                                        isValid={touched.price && !errors.price}
                                        isInvalid={touched.price && errors.price}
                                        type="text"
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.price}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-column position-relative" controlId="validationFormik08">
                                        <div className="d-flex flex-row">
                                            <Form.Label className="form-label">
                                                {selectedDrivers.length !==0 ?
                                                "Drivers: " + selectedDrivers.length + " drivers selected"
                                                : "Drivers: "}</Form.Label>
                                            {isSelectOptionsLoaded ? 
                                            driversOptionsExpanded ?
                                                <div onClick={() => setDriversOptionsExpandeded(false)} className="transition-button">
                                                    Collapse Drivers
                                                    <FontAwesomeIcon icon={"chevron-up"} className="ms-2"/>
                                                </div>
                                                :
                                                <div onClick={() => setDriversOptionsExpandeded(true)} className="transition-button">
                                                    Expand Drivers
                                                    <FontAwesomeIcon icon={"chevron-down"} className="ms-2"/>
                                                </div>
                                            :
                                            <Spinner animation="border" role="status" className="ms-3">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>}
                                        </div>

                                        {driversOptionsExpanded && isSelectOptionsLoaded ? 
                                        <CheckboxList
                                        UnselectedItem={UnselectedItem}
                                        SelectedItem={SelectedItem}
                                        data={remainingDrivers}
                                        selectedData={selectedDrivers}
                                        /> : null}
                                    </Form.Group>
                                    <Form.Group className="d-flex flex-row justify-content-end">
                                        <Button variant="primary" type="submit">
                                            Create
                                        </Button>
                                    </Form.Group>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>

                <Modal show={editModal} onHide={() => onHideEditModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Driver</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {!editItem ?
                        <Spinner animation="border" role="status" className="ms-3">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        :
                        <Formik
                        validationSchema={addSchema} 
                        onSubmit={(values) => editLine(values)}
                        initialValues={{
                            departure: editItem?.departure,
                            arrival: editItem?.arrival,
                            frequency: editItem?.frequency,
                            busType: editItem?.busType,
                            numberOfSeat: editItem?.numberOfSeat,
                            plateNumber: editItem?.plateNumber,
                            price: editItem?.price,
                        }}>
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form className="form" noValidate onSubmit={(handleSubmit)}>
                                    <Form.Group className="mb-3 d-flex flex-row">
                                        <Form.Label className="form-label">Line ID: {editItem?._id}</Form.Label>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik01">
                                        <Form.Label className="form-label">Departure:</Form.Label>
                                        <Form.Select 
                                        value={values.departure}
                                        name="departure"
                                        onChange={handleChange}
                                        isInvalid={touched.departure && errors.departure}
                                        type="text"
                                        className="form-input">
                                            <option value="">Choose place of departure</option>
                                            {locations.map(l => <option value={l}>{l}</option>)}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.departure}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik02">
                                        <Form.Label className="form-label">Arrival:</Form.Label>
                                        <Form.Select 
                                        value={values.arrival}
                                        name="arrival"
                                        onChange={handleChange}
                                        isInvalid={touched.arrival && errors.arrival}
                                        type="text"
                                        className="form-input">
                                            <option value="">Choose place of arrival</option>
                                            {locations.map(l => <option value={l}>{l}</option>)}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.arrival}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik03">
                                        <Form.Label className="form-label">Frequency:</Form.Label>
                                        <Form.Select 
                                        value={values.frequency}
                                        name="frequency"
                                        onChange={handleChange}
                                        isInvalid={touched.frequency && errors.frequency}
                                        type="text"
                                        className="form-input">
                                            <option value="">Choose frequency</option>
                                            {frequencies.map(f => <option value={f}>{f}</option>)}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.frequency}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik04">
                                        <Form.Label className="form-label">Bus Type:</Form.Label>
                                        <Form.Select 
                                        value={values.busType}
                                        name="busType"
                                        onChange={handleChange}
                                        isInvalid={touched.busType && errors.busType}
                                        type="text"
                                        className="form-input">
                                            <option value="">Choose bus type</option>
                                            {busTypes.map(b => <option value={b}>{b}</option>)}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.busType}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik05">
                                        <Form.Label className="form-label">Number of seats:</Form.Label>
                                        <Form.Control 
                                        value={values.numberOfSeat} 
                                        name="numberOfSeat"
                                        onChange={handleChange} 
                                        isValid={touched.numberOfSeat && !errors.numberOfSeat}
                                        isInvalid={touched.numberOfSeat && errors.numberOfSeat}
                                        type="text"
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.numberOfSeat}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik06">
                                        <Form.Label className="form-label">Plate Number:</Form.Label>
                                        <Form.Control 
                                        value={values.plateNumber} 
                                        name="plateNumber"
                                        onChange={handleChange} 
                                        isValid={touched.plateNumber && !errors.plateNumber}
                                        isInvalid={touched.plateNumber && errors.plateNumber}
                                        type="text"
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.plateNumber}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-row position-relative" controlId="validationFormik07">
                                        <Form.Label className="form-label">Price:</Form.Label>
                                        <Form.Control 
                                        value={values.price} 
                                        name="price"
                                        onChange={handleChange} 
                                        isValid={touched.price && !errors.price}
                                        isInvalid={touched.price && errors.price}
                                        type="text"
                                        className="form-input"/>
                                        <Form.Control.Feedback type="invalid" tooltip>{errors.price}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex flex-column position-relative" controlId="validationFormik08">
                                        <div className="d-flex flex-row">
                                            <Form.Label className="form-label">
                                                {selectedDrivers.length !==0 ?
                                                "Drivers: " + selectedDrivers.length + " drivers selected"
                                                : "Drivers: "}</Form.Label>
                                            {isSelectOptionsLoaded ? 
                                            driversOptionsExpanded ?
                                                <div onClick={() => setDriversOptionsExpandeded(false)} className="transition-button">
                                                    Collapse Drivers
                                                    <FontAwesomeIcon icon={"chevron-up"} className="ms-2"/>
                                                </div>
                                                :
                                                <div onClick={() => setDriversOptionsExpandeded(true)} className="transition-button">
                                                    Expand Drivers
                                                    <FontAwesomeIcon icon={"chevron-down"} className="ms-2"/>
                                                </div>
                                            :
                                            <Spinner animation="border" role="status" className="ms-3">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>}
                                        </div>

                                        {driversOptionsExpanded && isSelectOptionsLoaded ? 
                                        <CheckboxList
                                        UnselectedItem={UnselectedItem}
                                        SelectedItem={SelectedItem}
                                        data={remainingDrivers}
                                        selectedData={selectedDrivers}
                                        /> : null}
                                    </Form.Group>
                                    <Form.Group className="d-flex flex-row justify-content-end">
                                        <Button variant="primary" type="submit">
                                            Save
                                        </Button>
                                    </Form.Group>
                                </Form>
                            )}
                        </Formik>}
                    </Modal.Body>
                </Modal>

                <NotificationModal show={notificationModal} setShow={setNotificationModal} title={notificationTitle} body={notificationBody} setTitle={setNotificationTitle} setBody={setNotificationBody}/>

                <ConfirmationModal
                show={deleteConfirmationModal}
                setShow={setDeleteConfirmationModal}
                title={"Delete line #" + deleteItem?._id+"?"}
                confirmButtonVariant="danger"
                confirmButtonLabel="Delete"
                onConfirmed={() => deleteLine(deleteItem?._id)}/>
            </div>
        </WebpageBackground>
    )
}

export default Lines