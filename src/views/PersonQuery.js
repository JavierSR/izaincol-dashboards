import Loader from '../components/Loader'
import request from '../helpers/request'
import Logo from '../img/logo.png'
import Table from 'react-bootstrap/Table'
import { USER_CERTIFICATE_FIELDS } from '../constants'
import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { useLocation } from 'react-router-dom'

const Query = () => {
    const [data, setData] = useState({
        document: '',
        code: ''
    })
    const [userCertificates, setUserCertificates] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [refreshState, setRefreshState] = useState(false)
    const location = useLocation()

    const handleChange = (event) => {
        setData({...data, [event.target.name]: event.target.value})
    }

    const searchUserCertificates = () => {
        setIsLoading(true)
        request({
            route: 'getcertificateidentification',
            data
        }).then((response) => {
            setIsLoading(false)
            if(response.success) {
                setUserCertificates(response.data)
            }
            else {
                alert(response.message)
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const checkParamters = () => {
        const queryParams = new URLSearchParams(location.search)
        const document = queryParams.get('document')
        const code = queryParams.get('code')

        if(document && code) {
            setData({
                document,
                code
            })
            setRefreshState(true)
        }
    }

    useEffect(() => {
        checkParamters()
    }, [])

    useEffect(() => {
        if(refreshState) {
            searchUserCertificates()
        }
    }, [refreshState])

    return (
        <div className='dashboard'>
            {isLoading && <Loader />}
            <div className='shadow rounded bg-white dashboard-container dashboard-inner-container'>
                <div className='dashboard-header mb-5'>
                    <h2>Consulta de de certificados por persona</h2>
                    <img src={Logo} />
                </div>
                <div className='certificates'>
                    <div className='dashboard-container'>
                        <div className='certificates-header'>
                            <div className='search'>
                                <Form>
                                    <Form.Control
                                        type='number'
                                        value={data.document}
                                        placeholder='Número de documento'
                                        name='document'
                                        onChange={handleChange}
                                    />
                                    <Form.Control
                                        type='text'
                                        value={data.code}
                                        placeholder='Código de certificado'
                                        name='code'
                                        onChange={handleChange}
                                    />
                                </ Form>
                                <Button onClick={searchUserCertificates} className='mx-1' variant='warning'>Buscar</Button>
                            </div>
                        </div>
                        <Table bordered hover variant='dark'>
                            <thead>
                                <tr>
                                    {USER_CERTIFICATE_FIELDS.map((field, index) => (
                                        <th key={index}>{field.displayName}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className='custom-table'>
                                {userCertificates.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value?.name}</td>
                                        <td>{value?.document}</td>
                                        <td>{value?.scope}</td>
                                        <td>{value?.ability}</td>
                                        <td>{value?.rule}</td>
                                        <td>{value?.verification_code}</td>
                                        <td>{value?.expedition}</td>
                                        <td>{value?.validity}</td>
                                        <td>{value?.state}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <p className='w-100'>{userCertificates.length} {`${userCertificates.length !== 1 ? 'certificados encontrados' : 'certificado encontrado'}`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Query