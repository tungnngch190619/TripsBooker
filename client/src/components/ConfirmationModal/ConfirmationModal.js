import { Button, Modal } from "react-bootstrap"

const ConfirmationModal = (props) => {
    const {show, setShow, title, body, confirmButtonVariant, confirmButtonLabel, onConfirmed} = props

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
                <Button variant={confirmButtonVariant ?? "primary"} onClick={onConfirmed ?? null}>
                    {confirmButtonLabel ?? "Confirm"}
                </Button>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>
            </Modal.Footer>
      </Modal>
    )
}
export default ConfirmationModal