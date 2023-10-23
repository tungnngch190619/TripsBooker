import { Button, Modal } from "react-bootstrap"

const NotificationModal = (props) => {
    const {show, setShow, title, body} = props
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            {title ?
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>
            :
            null}

            {body ?
            <Modal.Body>
                {body}
            </Modal.Body>
            :
            null}

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
            </Modal.Footer>
      </Modal>
    )
}
export default NotificationModal