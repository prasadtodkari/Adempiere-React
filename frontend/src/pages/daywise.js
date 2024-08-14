import React, { useState } from 'react';
import axios from 'axios';
import url from '../components/config.json';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import loadingImage from '../cake.gif'; // Import your loading image

const Daywise = () => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false); // State variable for loading

    const handleSearch = async (e) => {
        e.preventDefault();
        if (start > end) {
            toast.error('Start date should be less than end Date..!!');
        } else {
            setLoading(true); // Set loading to true before making the API request
            try {
                const resp = await axios.post(`${url.urlb}/saleApi/performance`, { start, end });
                setResponse(resp.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error if needed
            } finally {
                setLoading(false); // Set loading to false after receiving the response
            }
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="d-flex card-body mt-2">
                            <div className="d-flex col-md-3 m-2">
                                <input type="date" max={new Date().toJSON().slice(0, 10)} min="2023-04-01" className="form-control" onChange={(e) => setStart(e.target.value)} />
                            </div>
                            <div className="col-md-3 m-2">
                                <input type="date" max={new Date().toJSON().slice(0, 10)} min="2023-04-01" className="form-control" onChange={(e) => setEnd(e.target.value)} />
                            </div>
                            <div className="col-md-2 m-2">
                                <button className="btn btn-success" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <img src={loadingImage} alt="Loading..." />
                </div>
            ) : response ? (
                <div className="row">
                    <div className='col-md-6'>
                        <div className='card'>
                            <div className='card-body'>
                                <h3 className='text-center text-danger mt-2'>High Return - Store List</h3>
                                <table className='table table-sm>'>
                                    <thead>
                                        <tr style={{ fontSize: '80%' }} className='text-center'>
                                            <th>Shope Name</th>
                                            <th>Order Amount</th>
                                            <th>Return Amount</th>
                                            <th>Return %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {response.highret.map((list, idx) => (
                                            <tr key={idx} style={{ fontSize: '90%' }}>
                                                <td>{list.shopname}</td>
                                                <td className='text-center'>{new Intl.NumberFormat('en-IN').format(list.total_order)}</td>
                                                <td className='text-center'>{new Intl.NumberFormat('en-IN').format(list.total_return)}</td>
                                                <td className='green'><span className='badge bg-danger'>{Math.round(list.diff, 0)}%</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className='card'>
                            <div className='card-body'>
                                <h3 className='text-center text-success mt-2'>Low Return - Store List</h3>
                                <table className='table table-sm>'>
                                    <thead>
                                        <tr style={{ fontSize: '80%' }} className='text-center'>
                                            <th className='text-sm'>Shope Name</th>
                                            <th>Order Amount</th>
                                            <th>Return Amount</th>
                                            <th>Return %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {response.lowret.map((list, idx) => (
                                            <tr key={idx} style={{ fontSize: '85%' }}>
                                                <td>{list.shopname}</td>
                                                <td className='text-center'>{new Intl.NumberFormat('en-IN').format(list.total_order)}</td>
                                                <td className='text-center'>{new Intl.NumberFormat('en-IN').format(list.total_return)}</td>
                                                <td className='green'><span className='badge bg-success'>{Math.round(list.diff, 0)}%</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-12'>
                        <div className='card'>
                            <h3 className='text-center text-info mt-2'>Category wise Return Details</h3>
                            <div className='card-body'>
                                <Bar data={{
                                    labels: response.chartret.map((res) => res.subcategory),
                                    datasets: [{
                                        label: 'Return Amount',
                                        data: response.chartret.map((res) => res.sum),
                                        borderColor: '#FC4804',
                                        backgroundColor: '#FD8659'
                                    }]
                                }} options={{
                                    locale: 'en-IN'
                                }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className='card'>
                            <h3 className='text-center text-danger mt-2'>High Return - Products</h3>
                            <div className='card-body'>
                                <table className='table table-sm'>
                                    <thead>
                                        <tr style={{ fontSize: '80%' }}>
                                            <th>Product Name</th>
                                            <th>Qty</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {response.prohigh.map((res, idx) => (
                                            <tr key={idx}>
                                                <td>{res.productname}</td>
                                                <td>{res.qty}</td>
                                                <td>{res.amt}</td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className='card'>
                            <h3 className='text-center text-success mt-2'>Low Return - Products</h3>
                            <div className='card-body'>
                                <table className='table table-sm'>
                                    <thead>
                                        <tr style={{ fontSize: '80%' }}>
                                            <th>Product Name</th>
                                            <th>Qty</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {response.prolow.map((res, idx) => (
                                            <tr key={idx}>
                                                <td>{res.productname}</td>
                                                <td>{res.qty}</td>
                                                <td>{res.amt}</td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">Data will be displayed here..</div>
            )}

            <ToastContainer position="top-right" theme="colored" transition={Bounce} />
        </>
    );
};

export default Daywise;
