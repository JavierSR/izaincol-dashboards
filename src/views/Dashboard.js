import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import '../css/dashboard.css'
import Logo from '../img/logo.png'
import Table from 'react-bootstrap/Table'
import ModalComponent from '../components/Modal'
import Form from 'react-bootstrap/Form'
import Loader from '../components/Loader'
import request from '../helpers/request'
import { useNavigate } from 'react-router-dom'
import { USER_CERTIFICATE_FIELDS, GROUP_CERTIFICATE_FIELDS } from '../constants'
import QRCode from 'qrcode.react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const EMPTY_USER_CERTIFICATE = {}

USER_CERTIFICATE_FIELDS.forEach((field) => {
    EMPTY_USER_CERTIFICATE[field.name] = field.type === 'date' ? new Date() : ''
})

const EMPTY_GROUP_CERTIFICATE = {}

GROUP_CERTIFICATE_FIELDS.forEach((field) => {
    EMPTY_GROUP_CERTIFICATE[field.name] = field.type === 'date' ? new Date() : ''
})

const Dashboard = () => {
    const navigation = useNavigate()
    const [userCertificates, setUserCertificates] = useState([])
    const [groupCertificates, setGroupCertificates] = useState([])
    const [modalOpen, setModalOpen] = useState(null)
    const [newUserCertificate, setNewUserCertificate] = useState(EMPTY_USER_CERTIFICATE)
    const [newGroupCertificate, setNewGroupCertificate] = useState(EMPTY_GROUP_CERTIFICATE)
    const [userErrors, setUserErrors] = useState('')
    const [groupErrors, setGroupErrors] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedQR, setSelectedQR] = useState(null)
    const [pages, setPages] = useState({
        user: 0,
        group: 0
    })

    const closeModals = () => {
        setModalOpen(null)
        setNewUserCertificate(EMPTY_USER_CERTIFICATE)
        setNewGroupCertificate(EMPTY_GROUP_CERTIFICATE)
        setUserErrors('')
        setGroupErrors('')
    }

    const openModal = (modal) => setModalOpen(modal)

    const handleChangeUser = (event) => {
        setNewUserCertificate({
            ...newUserCertificate,
            [event.target.name]: event.target.value
        })
    }

    const handleChangeGroup = (event) => {
        setNewGroupCertificate({
            ...newGroupCertificate,
            [event.target.name]: event.target.value
        })
    }

    const handleUserDateChange = (date, fieldName) => {
        setNewUserCertificate({
            ...newUserCertificate,
            [fieldName]: date
        })
    }

    const handleGroupDateChange = (date, fieldName) => {
        setNewGroupCertificate({
            ...newGroupCertificate,
            [fieldName]: date
        })
    }

    const triggerUpdate = () => {
        setIsLoading(true)
        Promise.all([
            request({ route: `usercertificates&page=${pages.user}` }),
            request({ route: `groupcertificates&page=${pages.group}` }),
        ]).then((responses) => {
            const [ userResult, groupsResult ] = responses

            setUserCertificates(userResult.success ? userResult.data : [])
            setGroupCertificates(groupsResult.success ? groupsResult.data : [])

            if(userResult.message === 'invalid cookie') {
                // navigation('/')
            }

        }).finally(() => {
            setIsLoading(false)
        })
    }

    const saveUserCertificate = () => {
        setUserErrors('')
        let emptyFields = []
        USER_CERTIFICATE_FIELDS.forEach((field) => {
            const value = newUserCertificate[field.name]
            if(!value.length && field.type !== 'date') {
                emptyFields = [...emptyFields, field.displayName]
            }
        })

        if(emptyFields.length) {
            setUserErrors(`Llene los siguientes campos: ${emptyFields.join(', ')}`)
            return
        }

        setIsLoading(true)
        request({
            route: 'createusercertificates',
            data: newUserCertificate
        }).then((response) => {
            if(response.success) {
                triggerUpdate()
                closeModals()
            }
            else {
                alert(response.message)
            }
        })
        .catch(() => {
            alert('No se pudo guardar el certificado')
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    const saveGroupCertificate = () => {
        setGroupErrors('')
        let emptyFields = []
        GROUP_CERTIFICATE_FIELDS.forEach((field) => {
            const value = newGroupCertificate[field.name]
            if(!value.length && field.type !== 'date') {
                emptyFields = [...emptyFields, field.displayName]
            }
        })

        if(emptyFields.length) {
            setGroupErrors(`Llene los siguientes campos: ${emptyFields.join(', ')}`)
            return
        }

        setIsLoading(true)
        request({
            route: 'creategroupcertificates',
            data: newGroupCertificate
        }).then((response) => {
            if(response.success) {
                triggerUpdate()
                closeModals()
            }
            else {
                alert(response.message)
            }
        })
        .catch(() => {
            alert('No se pudo guardar el certificado')
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        triggerUpdate()
    }, [pages])

    return (
        <div className='dashboard'>
            {isLoading && <Loader />}
            <ModalComponent
                show={selectedQR}
                title={`Consulta de certificado para ${selectedQR?.name || selectedQR?.name_group}`}
                handleClose={() => setSelectedQR(null)}
                errors=''
                showFooter={false}
            >
                <div className='d-flex justify-content-center'>
                    <QRCode 
                        renderAs='canvas' 
                        level='H'
                        includeMargin={true}
                        value={`${window.location.host}/#/consulta-certificados?${selectedQR?.document ? 'user' : 'group'}=${selectedQR?.document || selectedQR?.certificate}`}
                        size={256}
                    />
                </div>
            </ModalComponent>
            <div className='shadow rounded bg-white dashboard-container dashboard-inner-container'>
                <div className='dashboard-header mb-5'>
                    <h2>Administración de certificados</h2>
                    <img src={Logo} />
                </div>
                <div className='certificates'>
                    <div className='dashboard-container'>
                        <div className='certificates-header'>
                            <h4>Certificados por usuario</h4>
                            <Button onClick={() => openModal('USER')} variant='warning'>Agregar</Button>
                            <ModalComponent
                                show={modalOpen === 'USER'}
                                title='Agregar nuevo certificado individual'
                                handleClose={closeModals}
                                handleClick={saveUserCertificate}
                                errors={userErrors}
                                showFooter={true}
                            >
                                <Form>
                                    {USER_CERTIFICATE_FIELDS.map((field, index) => (
                                        <Form.Group key={index} className='mb-2'>
                                            <Form.Label>{field.displayName}</Form.Label>
                                            {field.type === 'date' ? (
                                                <DatePicker
                                                    className='form-control'
                                                    selected={newUserCertificate[field.name]}
                                                    onChange={(date) => handleUserDateChange(date, field.name)}
                                                />
                                            ) : 
                                                <Form.Control
                                                    type='text'
                                                    name={field.name}
                                                    value={newUserCertificate[field.name]}
                                                    onChange={handleChangeUser}
                                                />
                                            }
                                        </Form.Group>
                                    ))}
                                </Form>
                            </ModalComponent>
                        </div>
                        <Table striped bordered hover variant='dark'>
                            <thead>
                                <tr>
                                    {USER_CERTIFICATE_FIELDS.map((field, index) => (
                                        <th key={index}>{field.displayName}</th>
                                    ))}
                                    <th>QR</th>
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
                                        <td><Button onClick={() => setSelectedQR(value)} variant='warning'>Ver</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className='paginator'>
                            <Button onClick={() => setPages({...pages, user: --pages.user})} disabled={pages.user === 0} variant='warning'>{'<'}</Button>
                            <p>Página {pages.user + 1}</p>
                            <Button onClick={() => setPages({...pages, user: ++pages.user})} variant='warning'>{'>'}</Button>
                        </div>
                    </div>
                    <div className='dashboard-container'>
                        <div className='certificates-header'>
                            <h4>Certificados por grupo</h4>
                            <Button onClick={() => openModal('GROUP')} variant='warning'>Agregar</Button>
                            <ModalComponent
                                show={modalOpen === 'GROUP'}
                                title='Agregar nuevo certificado grupal'
                                handleClose={closeModals}
                                handleClick={saveGroupCertificate}
                                errors={groupErrors}
                                showFooter={true}
                            >
                                <Form>
                                    {GROUP_CERTIFICATE_FIELDS.map((field, index) => (
                                        <Form.Group key={index} className='mb-2'>
                                            <Form.Label>{field.displayName}</Form.Label>
                                            {field.type === 'date' ? (
                                                <DatePicker
                                                    className='form-control'
                                                    selected={newGroupCertificate[field.name]}
                                                    onChange={(date) => handleGroupDateChange(date, field.name)}
                                                />
                                            ) : 
                                                <Form.Control
                                                    type='text'
                                                    name={field.name}
                                                    value={newGroupCertificate[field.name]}
                                                    onChange={handleChangeGroup}
                                                />
                                            }
                                            
                                        </Form.Group>
                                    ))}
                                </Form>
                            </ModalComponent>
                        </div>
                        <Table striped bordered hover variant='dark'>
                            <thead>
                                <tr>
                                    {GROUP_CERTIFICATE_FIELDS.map((field, index) => (
                                        <th key={index}>{field.displayName}</th>
                                    ))}
                                    <th>QR</th>
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
                                        <td>{value?.expedition_date}</td>
                                        <td><Button onClick={() => setSelectedQR(value)} variant='warning'>Ver</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className='paginator'>
                            <Button onClick={() => setPages({...pages, group: --pages.group})} disabled={pages.group === 0} variant='warning'>{'<'}</Button>
                            <p>Página {pages.group + 1}</p>
                            <Button onClick={() => setPages({...pages, group: ++pages.group})} variant='warning'>{'>'}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard