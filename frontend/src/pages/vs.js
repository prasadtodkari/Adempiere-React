import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios';
import url from '../components/config.json'
import { Chart as Chartjs, Tooltip } from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar, Line } from 'react-chartjs-2'

Chartjs.register(Tooltip, annotationPlugin);

const Vs = () => {
    const [clist, setClist] = useState();
    const [firstSite, setFirstsite] = useState();
    const [secondSite, setSecondsite] = useState();
    const [firstname, setFirstname] = useState();
    const [secondname, setSecondName] = useState();
    const [catlist, setCatlist] = useState();
    const [firstcat, setfirstCat] = useState();
    const [secondcat, setSecondcat] = useState();
    const [selectedcat, setSelectedcat] = useState();

    useEffect(() => {
        const fetchlist = async () => {
            try {
                const arr = []
                const subcatlist = []
                const list = await axios.get(`${url.urlb}/saleApi/shop`)
                const subcat = await axios.get(`${url.urlb}/saleApi/subcats`)
                let result = list.data;
                result.map((li) => {
                    return arr.push({ value: li.shop, label: li.shop });
                });
                let res = subcat.data;
                res.map((li) => {
                    return subcatlist.push({ value: li.subcategory, label: li.subcategory })
                });
                setClist(arr)
                setCatlist(subcatlist)
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchlist()
    }, [])

    const handleFirst = async selectedFirst => {
        setFirstname(selectedFirst);
        const firstc = await axios.post(`${url.urlb}/saleApi/comp1`, { selectedFirst })
        setFirstsite(firstc.data.firstcust);
        setfirstCat(firstc.data.fcat);
    }

    const handleSecond = async selectedSecond => {
        setSecondName(selectedSecond);
        const secondc = await axios.post(`${url.urlb}/saleApi/comp2`, { selectedSecond })
        setSecondsite(secondc.data.secondcust);
        setSecondcat(secondc.data.scat);
    }

    const handleCat = selected => {
        setSelectedcat(selected);
    }

    const fcatdata = selectedcat ? firstcat.filter(e => e.subcategory === selectedcat.value) : []

    return (
        <div className='row'>
            <h6>In this page you can compare the result of Two different Stores</h6>
            <div className='col-md-6'>
                <div className='card bg-light'>
                    <div className='row d-flex justify-content-between'>
                        <div className='col-sm-3 m-2'>
                            <label className='badge bg-primary mt-2'>Select Your First Shop</label>
                        </div>
                        <div className='col-sm-8 m-2'>
                            <Select options={clist} onChange={handleFirst} placeholder={<div>Search Customer Here</div>} />
                        </div>
                        <div className='col-sm-1'></div>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                <div className='card bg-light'>
                    <div className='row d-flex justify-content-between'>
                        <div className='col-sm-3 m-2'>
                            <label className='badge bg-success mt-2'>Select Your Second Shop</label>
                        </div>
                        <div className='col-sm-8 m-2'>
                            <Select options={clist} onChange={handleSecond} placeholder={<div>Search Customer Here</div>} />
                        </div>
                        <div className='col-sm-1'></div>
                    </div>
                </div>
            </div>
            {firstSite && firstSite.length > 0 && (
                <>
                <div className='col-lg-6'>
                    <div className='card bg-light'>
                        <Bar data={{
                            labels: firstSite.map(res => res.mon),
                            datasets: [
                                {
                                    label: firstname.value,
                                    data: firstSite.map(res => res.total_order),
                                    backgroundColor: '#0d6efd'
                                },
                                ...(secondSite && secondSite.length > 0 ? [{
                                    label: secondname.value,
                                    data: secondSite.map(res => res.total_order),
                                    backgroundColor: '#198754'
                                }] : [])
                            ]
                        }} options={{
                            locale: 'en-IN',
                            scales: {
                                // y : {
                                //     ticks: {
                                //         display: false,
                                //         beginAtZero: true
                                //     }
                                // },
                                x : {
                                    reverse : true,
                                    ticks: {
                                        display: false
                                    }
                                }
                            },}} />
                    </div>
                </div>
                </>
            )}
            {firstSite && firstSite.length > 0 && (
                <div className='col-lg-6'>
                    <div className='card bg-light'>
                        <Line data={{
                            labels: firstSite.map(res => res.mon),
                            datasets: [
                                {
                                    label: firstname.value,
                                    data: firstSite.map(res => res.total_return),
                                    borderColor: '#0d6efd',
                                    tension: 0.5
                                },
                                ...(secondSite && secondSite.length > 0 ? [{
                                    label: secondname.value,
                                    data: secondSite.map(res => res.total_return),
                                    borderColor: '#198754',
                                    tension: 0.5
                                }] : [])
                            ]
                        }} options={{
                            locale: 'en-IN',
                            scales: {
                                // y : {
                                //     ticks: {
                                //         display: false,
                                //         beginAtZero: true
                                //     }
                                // },
                                x : {
                                    reverse : true,
                                    ticks: {
                                        display: false
                                    }
                                }
                            },}} />
                    </div>
                </div>
            )}
            {firstSite && firstSite.length > 0 && (
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='row p-2'>
                            <div className='col-sm-2'>
                                <label className='badge bg-danger mt-2'>Select Category</label>
                            </div>
                            <div className='col-sm-3'>
                                <Select options={catlist} onChange={handleCat}/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Bar data={{
                                    labels: fcatdata.map((res) => res.mon),
                                    datasets : [{
                                        label: 'Sale',
                                        data: fcatdata.map((res) => res.total_order)
                                    },
                                    {
                                        label: 'Return',
                                        data: fcatdata.map((res) => res.total_return)
                                    }]
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Vs