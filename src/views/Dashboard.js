import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import '../css/dashboard.css'
import Logo from '../img/logo.png'
import Table from 'react-bootstrap/Table'
import ModalComponent from '../components/Modal'
import Form from 'react-bootstrap/Form'
import Loader from '../components/Loader'
import request from '../helpers/request'

const USER_CERTIFICATE_FIELDS = [{
    name: 'name',
    displayName: 'Nombres y apellidos',
    }, {
    name: 'document',
    displayName: 'Documento',
    }, {
    name: 'scope',
    displayName: 'Alcance',
    }, {
    name: 'ability',
    displayName: 'Capacidad',
    }, {
    name: 'rule',
    displayName: 'Norma',
    }, {
    name: 'verification_code',
    displayName: 'Código de verificación',
    }, {
    name: 'expedition',
    displayName: 'Fecha expedición',
    }, {
    name: 'validiy',
    displayName: 'Vigencia',
    }, {
    name: 'state',
    displayName: 'Estado',
    }
]

const GROUP_CERTIFICATE_FIELDS = [{
    name: 'certificate',
    displayName: 'Certificado',
    }, {
    name: 'name_group',
    displayName: 'Nombre de equipo',
    }, {
    name: 'type',
    displayName: 'Tipo',
    }, {
    name: 'rule',
    displayName: 'Norma',
    }, {
    name: 'brand',
    displayName: 'Marca',
    }, {
    name: 'serie',
    displayName: 'Serie',
    }, {
    name: 'model',
    displayName: 'Modelo',
    }, {
    name: 'expedition_date',
    displayName: 'Fecha expedición',
    }, {
    name: 'state',
    displayName: 'Estado',
    }
]

const EMPTY_USER_CERTIFICATE = {}

USER_CERTIFICATE_FIELDS.forEach((field) => {
    EMPTY_USER_CERTIFICATE[field.name] = ''
})

const EMPTY_GROUP_CERTIFICATE = {}

GROUP_CERTIFICATE_FIELDS.forEach((field) => {
    EMPTY_GROUP_CERTIFICATE[field.name] = ''
})

const Dashboard = () => {
    const [userCertificates, setUserCertificates] = useState([])
    const [groupCertificates, setGroupCertificates] = useState([])
    const [modalOpen, setModalOpen] = useState(null)
    const [newUserCertificate, setNewUserCertificate] = useState(EMPTY_USER_CERTIFICATE)
    const [newGroupCertificate, setNewGroupCertificate] = useState(EMPTY_GROUP_CERTIFICATE)
    const [userErrors, setUserErrors] = useState('')
    const [groupErrors, setGroupErrors] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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

    const triggerUpdate = () => {
        setIsLoading(true)
        Promise.all(
            request({ route: 'groupcertificates&page=0' }),
            request({ route: 'usercertificates&page=0' }),
        ).then((responses) => {
            console.log(responses)
            const [ userResult, groupsResult ] = responses

            if(userResult.success) {
                setUserCertificates(userResult.data)
            }

            if(groupsResult.success) {
                setGroupCertificates(groupsResult.data)
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
            if(!value.length) {
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
            console.log(response)
            if(response.success) {
                triggerUpdate()
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
            if(!value.length) {
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
            console.log(response)
            if(response.success) {
                triggerUpdate()
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
    }, [])

    return (
        <div className='dashboard'>
            {isLoading && <Loader />}
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
                            >
                                <Form>
                                    {USER_CERTIFICATE_FIELDS.map((field, index) => (
                                        <Form.Group key={index} className='mb-2'>
                                            <Form.Label>{field.displayName}</Form.Label>
                                            <Form.Control
                                                type='text'
                                                name={field.name}
                                                value={newUserCertificate[field.name]}
                                                onChange={handleChangeUser}
                                            />
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
                            <Button onClick={() => openModal('GROUP')} variant='warning'>Agregar</Button>
                            <ModalComponent
                                show={modalOpen === 'GROUP'}
                                title='Agregar nuevo certificado grupal'
                                handleClose={closeModals}
                                handleClick={saveGroupCertificate}
                                errors={groupErrors}
                            >
                                <Form>
                                    {GROUP_CERTIFICATE_FIELDS.map((field, index) => (
                                        <Form.Group key={index} className='mb-2'>
                                            <Form.Label>{field.displayName}</Form.Label>
                                            <Form.Control
                                                type='text'
                                                name={field.name}
                                                value={newGroupCertificate[field.name]}
                                                onChange={handleChangeGroup}
                                            />
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

export default Dashboard