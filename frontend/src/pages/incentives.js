import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Select from 'react-select'
import url from '../components/config.json'
import loading from '../search.gif'



const Incentive = () => {
    const [monlist, setMonlist] = useState();
    const [selected, setSelected] = useState();
    const [incent, setIncent] = useState();

    useEffect(() => {
        const fetchmonth = async () => {
            let monarray = []
            const mlist = await axios.get(`${url.urlb}/saleApi/incentive`)
            mlist.data[0].month.map((res) => { return monarray.push({ value: res.mon, label: res.mon }) })
            setMonlist(monarray);
            setIncent(mlist.data[0].indata)
        }
        fetchmonth();
    }, [])

    const handleMonth = selectedMonth => {
        setSelected(selectedMonth);
    }
    const tabledata = selected ? incent.filter(item => item.month === selected.value) : '';
    const incentive_a = selected ? tabledata.filter(list => list.ord_rt_ratio < 3) : '';
    const incentive_b = selected ? tabledata.filter(list => list.ord_rt_ratio > 3 && list.ord_rt_ratio < 5) : [];
    const notearn = selected ? tabledata.filter(list => list.ord_rt_ratio > 5) : [];

    const calculateIncentive = (orderAmount, returnAmount, orderReturnRatio) => {
        if (orderReturnRatio < 3) {
            return (orderAmount - returnAmount) * 5 * 0.01;
        } else if (orderReturnRatio < 5) {
            return (orderAmount - returnAmount) * 3 * 0.01;
        } else {
            return '10'
        }

    };
    
    return (
        <>
            <section className="section dashboard">
                {monlist ? 
                <div className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className='col-xxl-3 col-md-3'>
                                <div className='card info-card revenue-card'>
                                    <div className='card-body'>
                                        <div className="row mt-2">
                                            <h5 className='text-danger'>Select Month</h5>
                                            <div className="mt-2">
                                                <Select options={monlist} onChange={handleMonth} placeholder={<div>Select Month</div>} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-3 col-md-2">
                                <div className="card info-card sales-card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mt-4">
                                            <div className="ps-3">
                                                <h6>{selected ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(incentive_a.reduce((acc, curr) => acc + ((curr.ord_amt - curr.rt_amt) * 5 * 0.01), 0)) : 0}</h6>
                                                <span className="text-success small pt-1 fw-bold">{selected ? incentive_a.length : 0}</span> <span className="text-muted small pt-2 ps-1">Store Earning 5%</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xxl-3 col-md-4">
                                <div className="card info-card revenue-card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mt-4">
                                            <div className="ps-3">
                                            <h6>{selected ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(incentive_b.reduce((acc, curr) => acc + ((curr.ord_amt - curr.rt_amt) * 3 * 0.01), 0)) : 0}</h6>
                                                <span className="text-warning small pt-1 fw-bold">{selected ? incentive_b.length : 0}</span> <span className="text-muted small pt-2 ps-1">Store Earning 3%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xxl-3 col-md-4">
                                <div className="card info-card customers-card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mt-4">
                                            <div className="ps-3">
                                                <h6>₹ 0</h6>
                                                <span className="text-danger small pt-1 fw-bold">{selected ? notearn.length : 0}</span> <span className="text-muted small pt-2 ps-1">Missed out the Incentive</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-body'>
                                <h5 className='card-title'>List of Store earning 5% Incentive</h5>
                                    <table className='table table-sm table-border'>
                                        <thead>
                                            <tr style={{fontSize: '80%'}}>
                                                <th>Shop Name</th>
                                                <th>Order Amount</th>
                                                <th>Return Amount</th>
                                                <th>Return %</th>
                                                <th>Incentive</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {incentive_a ?
                                                incentive_a.map((res, idx) => (
                                                    <tr key={idx} style={{fontSize : '80%'}}>
                                                        <td>{res.shopname}</td>
                                                        <td className='text-center'>{new Intl.NumberFormat('en-IN').format(res.ord_amt)}</td>
                                                        <td className='text-center'>{new Intl.NumberFormat('en-IN').format(res.rt_amt)}</td>
                                                        <td ><span className={res.ord_rt_ratio < 3 ? 'text-center badge bg-success' : res.ord_rt_ratio < 5 ? 'text-center badge bg-warning' : 'text-center badge bg-danger'}>{res.ord_rt_ratio} %</span></td>
                                                        <td>{calculateIncentive(res.ord_amt, res.rt_amt, res.ord_rt_ratio) === '10' ? <span className='badge- bg-danger'>Not eligible</span> : new Intl.NumberFormat('en-IN').format(calculateIncentive(res.ord_amt, res.rt_amt, res.ord_rt_ratio))}</td>
                                                    </tr>
                                                ))
                                                : ''}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-body table-responsive'>
                                <h5 className='card-title'>List of Store earning 3% Incentive</h5>
                                    <table className='table table-sm table-border'>
                                        <thead>
                                            <tr style={{fontSize: '80%'}}>
                                                <th>Shop Name</th>
                                                <th>Order Amount</th>
                                                <th>Return Amount</th>
                                                <th>Return %</th>
                                                <th>Incentive</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {incentive_b ?
                                                incentive_b.map((res, idx) => (
                                                    <tr key={idx} style={{fontSize : '80%'}}>
                                                        <td>{res.shopname}</td>
                                                        <td className='text-center'>{new Intl.NumberFormat('en-IN').format(res.ord_amt)}</td>
                                                        <td className='text-center'>{new Intl.NumberFormat('en-IN').format(res.rt_amt)}</td>
                                                        <td ><span className={res.ord_rt_ratio < 3 ? 'text-center badge bg-success' : res.ord_rt_ratio < 5 ? 'text-center badge bg-warning' : 'text-center badge bg-danger'}>{res.ord_rt_ratio} %</span></td>
                                                        <td>{calculateIncentive(res.ord_amt, res.rt_amt, res.ord_rt_ratio) === '10' ? <span className='badge- bg-danger'>Not eligible</span> : new Intl.NumberFormat('en-IN').format(calculateIncentive(res.ord_amt, res.rt_amt, res.ord_rt_ratio))}</td>
                                                    </tr>
                                                ))
                                                : ''}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card'>
                                <div className='card-body'>
                                <h5 className='card-title'>List of Store missed out the Incentive</h5>
                                    <table className='table table-sm table-border'>
                                        <thead>
                                            <tr style={{fontSize: '80%'}}>
                                                <th>Shop Name</th>
                                                <th>Order Amount</th>
                                                <th>Return Amount</th>
                                                <th>Return %</th>
                                                <th>Incentive</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notearn ?
                                                notearn.map((res, idx) => (
                                                    <tr key={idx} style={{fontSize : '80%'}}>
                                                        <td>{res.shopname}</td>
                                                        <td className='text-center'>{new Intl.NumberFormat('en-IN').format(res.ord_amt)}</td>
                                                        <td className='text-center'>{new Intl.NumberFormat('en-IN').format(res.rt_amt)}</td>
                                                        <td ><span className={res.ord_rt_ratio < 3 ? 'text-center badge bg-success' : res.ord_rt_ratio < 5 ? 'text-center badge bg-warning' : 'text-center badge bg-danger'}>{res.ord_rt_ratio} %</span></td>
                                                        <td>{calculateIncentive(res.ord_amt, res.rt_amt, res.ord_rt_ratio) === '10' ? <span className='badge bg-danger'>Not eligible</span> : new Intl.NumberFormat('en-IN').format(calculateIncentive(res.ord_amt, res.rt_amt, res.ord_rt_ratio))}</td>
                                                    </tr>
                                                ))
                                                : ''}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div className="text-center">
                    <img src={loading} alt="Loading..." />
                  </div>}
            </section>
        </>
    )
}

export default Incentive