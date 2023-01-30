import Loader from '../components/Loader'
import request from '../helpers/request'
import Logo from '../img/logo.png'
import Table from 'react-bootstrap/Table'
import { GROUP_CERTIFICATE_FIELDS } from '../constants'
import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { useLocation } from 'react-router-dom'

const Query = () => {
    const [groupCode, setGroupCode] = useState([])
    const [groupCertificates, setGroupCertificates] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [refreshState, setRefreshState] = useState(false)
    const location = useLocation()
    
    const handleGroupChange = (event) => {
        setGroupCode(event.target.value)
    }

    const searchGroupCertificates = () => {
        setIsLoading(true)
        request({
            route: 'getcertificatecertificate',
            data: {
                certificate: groupCode
            }
        }).then((response) => {
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
        const group = queryParams.get('group')

        if (group) {
            setGroupCode(group)
            setRefreshState(true)
        }
    }

    useEffect(() => {
        checkParamters()
    }, [])

    useEffect(() => {
        if (refreshState) {
            searchGroupCertificates()
        }
    }, [refreshState])

    return (
        <div className='dashboard'>
            {isLoading && <Loader />}
            <div className='shadow rounded bg-white dashboard-container dashboard-inner-container'>
                <div className='dashboard-header mb-5'>
                    <h2>Consulta de de certificados por equipos</h2>
                    <img src={Logo} />
                </div>
                <div className='certificates'>
                    <div className='dashboard-container'>
                        <div className='certificates-header'>
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
                        <Table bordered hover variant='dark'>
                            <thead>
                                <tr>
                                    {GROUP_CERTIFICATE_FIELDS.map((field, index) => (
                                        <th key={index}>{field.displayName}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className='custom-table'>
                                {groupCertificates.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value?.certificate}</td>
                                        <td>{value?.name_group}</td>
                                        <td>{value?.type}</td>
                                        <td>{value?.rule}</td>
                                        <td>{value?.brand}</td>
                                        <td>{value?.serie}</td>
                                        <td>{value?.model}</td>
                                        <td>{value?.expedition_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <p className='w-100'>{groupCertificates.length} {`${groupCertificates.length !== 1 ? 'certificados encontrados' : 'certificado encontrado'}`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Query