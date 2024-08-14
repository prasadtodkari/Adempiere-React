import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Select from 'react-select'

import url from '../components/config.json'
import { InfoCircle } from "react-bootstrap-icons";
import { Bar } from 'react-chartjs-2';


function Shop() {
    const [clist, setClist] = useState([""])
    const [chart, setChart] = useState([])
    const [sytd, setSytd] = useState()
    const [selected, setSelected] = useState()
    const [selectedC, setSelectedC] = useState()
    const [month, setMonth] = useState([""])
    const [category, setCategory] = useState()
    const [ucat, setUcat] = useState()

    useEffect(() => {
        const fetchlist = async () => {
            try {
                const arr = []
                const list = await axios.get(`${url.urlb}/saleApi/shop`)
                let result = list.data;
                result.map((li) => {
                    return arr.push({ value: li.shop, label: li.shop });
                });
                setClist(arr)
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchlist()
    }, [])

    const handleVChange = async (options) => {
        let id = options.value;
        try {
            const marr = []
            const carr = []
            const ytd = await axios.get(`${url.urlb}/saleApi/shops/${id}`)
            setSytd(ytd.data[0].shopytd)
            let umonth = ytd.data[0].shopytd;
            umonth.map((e) => {
                return marr.push({ value: e.month, label: e.month });
            });
            setMonth(marr);
            setCategory(ytd.data[0].shopcat)
            console.log(ytd.data[0].shopcat);
            let unic = [...new Set(ytd.data[0].shopcat.map(item => item.category_group))];
            unic.map((e) => {
                return carr.push({ value: e, label: e });
            })
            setUcat(carr);

            if (ytd.data[0].shopytd.length > 0) {
                setChart({
                    labels: ytd.data[0].shopytd.map((res) => res.month),
                    datasets: [{
                        label: 'Order',
                        data: ytd.data[0].shopytd.map((res) => res.order),
                        backgroundColor: [
                            'rgba(88, 214, 141, 0.8)'
                        ],
                        borderColor: [
                            'rgb(29, 131, 72)'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'Sale',
                        data: ytd.data[0].shopytd.map((res) => res.sale),
                        backgroundColor: [
                            'rgba(123, 16, 28, 0.8)'
                        ],
                        borderColor: [
                            'rgba(192, 57, 43)'
                        ],
                        borderWidth: 1,
                        type: 'line',
                        order: 0
                    }]
                })
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleMonth = selectedMonth => {
        setSelected(selectedMonth);
    }

    const handleCat = selectedCat => {
        setSelectedC(selectedCat)
    }

    const dchart = selected ? category.filter(item => item.month === selected.value) : '';
    const catchart = selectedC ? category.filter(item => item.category_group === selectedC.value) : '';

    console.log(category);

    const bchart = {
        labels: catchart ? catchart.map((res) => res.month) : [],
        datasets: [{
            label: 'sale',
            data: catchart ? catchart.map((res) => res.sale) : [],
            backgroundColor : '#27AE60'
        },
        {
            label: 'return',
            data: catchart ? catchart.map((res) => res.return) : [],
            backgroundColor: '#34495E'
        }
    ]
    }


    const pchart = {
        labels: dchart ? dchart.map((res) => res.category_group) : [],
        datasets: [{
            label: 'Sale',
            data: dchart ? dchart.map((res) => res.sale) : [],
            backgroundColor: [
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
        },
        {
            label: 'return',
            data: dchart ? dchart.map((res) => res.return) : [],
            backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        }]
    }

    return (
        <>
            <section className="section">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <form>
                                    <div className="row mt-2">
                                        <div className='col-sm-3'>
                                            <h5 className='card-title'>Select Customer Name</h5>
                                        </div>
                                        <div className="col-sm-6 mt-3">
                                            <Select options={clist} onChange={handleVChange} placeholder={<div>Search Customer Here</div>} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {sytd ? (
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='card'>
                                <div className='card-body'>
                                    <p></p>
                                    <table className='table table-sm table-hover'>
                                        <thead>
                                            <tr className='bg-dark text-white'>
                                                <th>Month</th>
                                                <th className='text-end'>Order</th>
                                                <th className='text-end'>Return</th>
                                                <th className='text-center'>%</th>
                                                <th className='text-end'>Sale</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sytd.map(res => (
                                                <tr>
                                                    <td className='text-primary'><small>{res.month}</small></td>
                                                    <td className='text-end'><small>{new Intl.NumberFormat('en-IN').format(res.order,)}</small></td>
                                                    <td className='text-end'><small>{new Intl.NumberFormat('en-IN').format(res.return,)}</small></td>
                                                    <td><span className={res.rt > 5 ? 'text-center badge bg-danger m-2' : res.rt > 3 ? 'text-center badge bg-warning m-2' : 'text-center badge bg-success m-2'}>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(res.rt)} %</span></td>
                                                    <td className='text-end'><small>{new Intl.NumberFormat('en-IN').format(res.sale,)}</small></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-8'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>YTD Sales Details</h5>
                                    <Bar data={chart} />
                                </div>
                            </div>
                        </div>
                        <div className='col-md-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <div className="row mt-2">
                                        <div className='col-sm-3'>
                                            <h5 className='card-title'>Month wise comparison</h5>
                                        </div>
                                        <div className="col-sm-3 mt-3">
                                            <Select options={month} onChange={handleMonth} placeholder={<div>Select Month</div>} />
                                        </div>
                                    </div>
                                    <Bar data={pchart} />
                                </div>
                            </div>
                        </div>
                        {ucat ? 
                        <div className='col-md-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <div className='row mt-2'>
                                        <div className='col-sm-3'>
                                            <h5 className='card-title'>Category wise comparison</h5>
                                        </div>
                                        <div className="col-sm-3 mt-3">
                                            <Select options={ucat} onChange={handleCat} placeholder={<div>Select Category</div>} />
                                        </div>
                                    </div>
                                    <Bar data={bchart} />
                                </div>
                            </div>
                        </div> : ''}
                    </div>


                ) : (
                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                        <InfoCircle />
                        <span> After selecting Shop Name Data will be displayed here...!</span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )

                }
            </section>
        </>
    )
}

export default Shop