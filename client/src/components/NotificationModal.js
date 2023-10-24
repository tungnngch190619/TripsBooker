import { Button, Modal } from "react-bootstrap"

const NotificationModal = (props) => {
    const {show, setShow, title, body, setTitle, setBody} = props
    const onHide = () => {
        setShow(false)
        if(title && setTitle) {
            setTitle("")
        }
        if(body && setBody) {
            setBody("")
        }
    }
    return (
        <Modal show={show} onHide={() => onHide()}>
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
                <Button variant="secondary" onClick={() => onHide()}>
                    Close
                </Button>
            </Modal.Footer>
      </Modal>
    )
}
export default NotificationModal