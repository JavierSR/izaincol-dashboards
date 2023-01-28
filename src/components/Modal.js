import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'

const ModalComponent = ({ show, title, handleClose, handleClick, children, errors }) => (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
            {!!errors.length && (
                <Alert className='w-100' variant='danger'>{errors}</Alert>
            )}
            <Button variant='warning' onClick={handleClick}>
                Guardar
            </Button>
        </Modal.Footer>
    </Modal>
)

export default ModalComponent