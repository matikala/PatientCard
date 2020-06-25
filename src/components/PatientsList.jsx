import React, { useEffect, useState } from 'react'
import axio from '../utils'
import { InputBase, Card, CardContent, CardActions, Typography, Button } from '@material-ui/core'
import { Link } from 'react-router-dom';


const PatientsList = (props) => {
    const [patients, setPatients] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        const getPatients = async () => {
            const { data: { entry } } = await axio.get('Patient')
            return entry.map(({ resource: { id, name, birthDate, address, telecom } }) => {
                return { id, name, birthDate, address, telecom }
            })
        }
        getPatients().then(patients => setPatients(patients))
    }, [])

    return (
        <div>
            <InputBase
                placeholder="Search patient by surname..."
                onChange={event => setSearch(event.target.value)} />
            {
                patients.filter(patient => patient.name[0].family.toLowerCase().match(search.toLowerCase())).map((patient) => {
                    return (
                        <Card>
                            <CardContent>
                                <Typography variant="body1" paragraph>
                                    Name: {patient.name[0].given[0]} {patient.name[0].family}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Birth date: {patient.birthDate}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Link to={`/patients/${patient.id}`}>
                                    <Button size="small">Show details</Button>
                                </Link>
                            </CardActions>
                        </Card>
                    )
                })
            }
        </div >
    )
}

export default PatientsList