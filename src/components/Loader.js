import Spinner from 'react-bootstrap/Spinner'
import '../css/loader.css'

const Loader = () => (
    <div className='overlay'>
        <Spinner animation='border' variant='warning' />
    </div>
)

export default Loader