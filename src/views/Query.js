import Loader from '../components/Loader'
import request from '../helpers/request'
import Logo from '../img/logo.png'
import Table from 'react-bootstrap/Table'
import { USER_CERTIFICATE_FIELDS, GROUP_CERTIFICATE_FIELDS } from '../constants'
import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { useLocation } from 'react-router-dom'

const Query = () => {
    const [userCode, setUserCode] = useState([])
    const [groupCode, setGroupCode] = useState([])
    const [userCertificates, setUserCertificates] = useState([])
    const [groupCertificates, setGroupCertificates] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [refreshState, setRefreshState] = useState(false)
    const location = useLocation()

    const handleUserChange = (event) => {
        setUserCode(event.target.value)
    }
    
    const handleGroupChange = (event) => {
        setGroupCode(event.target.value)
    }

    const searchUserCertificates = () => {
        setIsLoading(true)
        request({
            route: 'getcertificateidentification',
            data: {
                document: userCode
            }
        }).then((response) => {
            console.log(response)
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

    const searchGroupCertificates = () => {
        setIsLoading(true)
        request({
            route: 'getcertificatecertificate',
            data: {
                certificate: groupCode
            }
        }).then((response) => {
            console.log(response)
            setIsLoading(false)
            if(response.success) {
                setGroupCertificates(response.data)
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
        const user = queryParams.get('user')
        const group = queryParams.get('group')

        if(user) {
            setUserCode(user)
            setRefreshState('user')
        }
        else if (group) {
            setGroupCode(group)
            setRefreshState('group')
        }
    }

    useEffect(() => {
        checkParamters()
    }, [])

    useEffect(() => {
        if(refreshState === 'user') {
            searchUserCertificates()
        }
        else if (refreshState === 'group') {
            searchGroupCertificates()
        }

    }, [refreshState])

    return (
        <div className='dashboard'>
            {isLoading && <Loader />}
            <div className='shadow rounded bg-white dashboard-container dashboard-inner-container'>
                <div className='dashboard-header mb-5'>
                    <h2>Consulta de de certificados</h2>
                    <img src={Logo} />
                </div>
                <div className='certificates'>
                    <div className='dashboard-container'>
                        <div className='certificates-header'>
                            <h4>Certificados por usuario</h4>
                            <div className='search'>
                                <Form>
                                    <Form.Control
                                        type='text'
                                        value={userCode}
                                        placeholder='Número de documento'
                                        onChange={handleUserChange}
                                    />
                                </ Form>
                                <Button onClick={searchUserCertificates} className='mx-1' variant='warning'>Buscar</Button>
                            </div>
                        </div>
                        <Table striped bordered hover variant='dark'>
                            <thead>
                                <tr>
                                    {USER_CERTIFICATE_FIELDS.map((field, index) => (
                                        <th key={index}>{field.displayName}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
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
                    </div>
                    <div className='dashboard-container'>
                        <div className='certificates-header'>
                            <h4>Certificados por grupo</h4>
                            <div className='search'>
                                <Form>
                                    <Form.Control
                                        type='text'
                                        value={groupCode}
                                        onChange={handleGroupChange}
                                        placeholder='Código de certificado'
                                    />
                                </ Form>
                                <Button onClick={searchGroupCertificates} className='mx-1' variant='warning'>Buscar</Button>
                            </div>
                        </div>
                        <Table striped bordered hover variant='dark'>
                            <thead>
                                <tr>
                                    {GROUP_CERTIFICATE_FIELDS.map((field, index) => (
                                        <th key={index}>{field.displayName}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {groupCertificates.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value?.certificate}</td>
                                        <td>{value?.name_group}</td>
                                        <td>{value?.type}</td>
                                        <td>{value?.rule}</td>
                                        <td>{value?.brand}</td>
                                        <td>{value?.serie}</td>
                                        <td>{value?.model}</td>
                                        <td>{value?.validity}</td>
                                        <td>{value?.expedition_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Query