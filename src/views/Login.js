import Logo from '../img/logo.png'
import '../css/login.css'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import request from '../helpers/request'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigation = useNavigate()
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.type]: event.target.value
        })
    }

    const handleClick = () => {
        setError('')
        if(!data.email.length || !data.password.length) {
            setError('Escriba correo y contraseña')
            return
        }

        setIsLoading(true)
        request({
            route: 'login',
            data
        }).then((response) => {
            console.log(response)
            if(response.success) {
                navigation('/dashboard')
            }
            else {
                setError(response.message)
            }
        })
        .catch(() => {
            setError('Error al iniciar sesión')
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <div className='container'>
            {isLoading && <Loader />}
            <div className='card shadow bg-white rounded'>
                <img src={Logo} />
                <Form className='pt-5'>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Correo @&nbsp;&nbsp;&nbsp;</InputGroup.Text>
                        <Form.Control
                            aria-label="Email"
                            aria-describedby="email"
                            type='email'
                            value={data.email}
                            onChange={handleChange}
                            autoComplete='email'
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Contraseña </InputGroup.Text>
                        <Form.Control
                            type='password'
                            onChange={handleChange}
                            value={data.password}
                            autoComplete='current-password'
                        />
                    </InputGroup>
                    {!!error.length && (
                        <Alert variant='danger'>{error}</Alert>
                    )}
                    <Button className='button' variant='warning' onClick={handleClick}>Ingresar</Button>
                </Form>
            </div>
        </div>
    )
}

export default Login