import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Timeline,
    Events,
    TextEvent,
} from '@merc/react-timeline'
import axio from '../utils'
import { Typography, TextField } from '@material-ui/core'
import { Chart } from 'react-charts'


const PatientsDetails = (props) => {
    const [data, setData] = useState([])
    const [patient, setPatient] = useState({
        name: '',
        address: '',
        birthDate: '',
        telcom: ''
    })
    const [fromDate, setFromDate] = useState('1900-01-01')
    const [toDate, setToDate] = useState('2100-01-01')
    const [chartData, setChartData] = useState([])
    const { id } = useParams()


    const axes = React.useMemo(
        () => [
            { primary: true, type: 'time', position: 'bottom' },
            {
                type: 'linear', position: 'left', stacked: true
            },
        ],
        []
    )

    useEffect(async () => {
        await axio.get(`Patient/${id}`).then((response) => {
            setPatient({
                name: `${response.data.name[0].given[0]} ${response.data.name[0].family}`,
                birthDate: response.data.birthDate,
                address: `${response.data.address[0].line[0]}, ${response.data.address[0].city}, ${response.data.address[0].country}`,
                telecom: response.data.telecom[0].value
            })
        })
    }, [id])

    useEffect(async () => {
        await axio.get(`Observation?patient=${id}&_count=1000`).then((response) => {
            const prep = response.data.entry.map(({ resource: { category, code, valueQuantity, effectiveDateTime } }) => {
                return {
                    date: effectiveDateTime.substr(0, 10),
                    name: `${code.text}`,
                    value: `${valueQuantity ? Math.round(valueQuantity.value * 100) / 100 : ''}`,
                    text: `${category[0].coding[0].display} : ${code.text} : ${valueQuantity ? Math.round(valueQuantity.value * 100) / 100 : ''}`
                }
            })
            setData((prev => [...prev, ...prep]))
        })

        await axio.get(`MedicationRequest?patient=${id}&_count=1000`).then((response) => {
            const prep = response.data.entry.map(({ resource: { id, medicationCodeableConcept, authoredOn } }) => {
                return { date: authoredOn.substr(0, 10), name: `${medicationCodeableConcept.text}`, value: -1, text: `${medicationCodeableConcept.text}` }
            })
            setData((prev => [...prev, ...prep]))
        })

    }, [])

    const changeChart = clickedData => {
        if (clickedData.value === -1) {
            return
        }
        const newDataArray = []
        data.filter(d => (
            d.name.includes(clickedData.name) && new Date(d.date) >= new Date(fromDate) && new Date(d.date) <= new Date(toDate)
        )).forEach(d => {
            newDataArray.push([new Date(d.date), parseFloat(d.value)])
        })
        setChartData([{
            label: clickedData.text,
            data: newDataArray
        }])
    }

    return (
        <div class="main">
            <div class="left" style={{ float: 'left', width: '30%', position: 'fixed', marginLeft: '5%', marginTop: '2%' }}>
                {patient !== undefined ?
                    <div>
                        <Typography variant="h6" paragraph>ID: {id}</Typography>
                        <Typography variant="h6" paragraph>Name: {patient.name}</Typography>
                        <Typography variant="h6" paragraph>Birth date: {patient.birthDate}</Typography>
                        <Typography variant="h6" paragraph>Address: {patient.address}</Typography>
                        <Typography variant="h6" paragraph>Phone number: {patient.telecom}</Typography>
                    </div> : null}
                <div>
                    <form noValidate>
                        <TextField
                            label="From"
                            type="date"
                            onChange={event => setFromDate(event.target.value)}
                            InputLabelProps={{ shrink: true, }} />
                    </form>
                    <form noValidate>
                        <TextField
                            label="To"
                            type="date"
                            onChange={event => setToDate(event.target.value)}
                            InputLabelProps={{ shrink: true, }} />
                    </form>
                </div>
                <div
                    style={{
                        width: '500px',
                        height: '300px',
                        margin: '5%'
                    }}
                >
                    <Chart data={chartData} axes={axes} />
                </div>
            </div>
            <div style={{ float: 'right', marginTop: '5%', paddingRight: '30%' }} >
                <Timeline>
                    <Events>
                        {data.filter(d => new Date(d.date) >= new Date(fromDate) && new Date(d.date) <= new Date(toDate)).sort((a, b) => {
                            return new Date(b.date) - new Date(a.date);
                        }).map((data) => (
                            <div id={data.text} onClick={
                                e => {
                                    e.preventDefault()
                                    changeChart(data)
                                }}>
                                <TextEvent date={data.date} text={data.text} />
                            </div>
                        ))}
                    </Events>
                </Timeline>
            </div>
        </div >
    );
};

export default PatientsDetails;