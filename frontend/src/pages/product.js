import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import axios from 'axios';
import { format } from 'date-fns'
import url from '../components/config.json'
import { Chart as Chartjs, plugins } from 'chart.js/auto'
import { Line, Bar } from 'react-chartjs-2'
import { InfoCircle, MinecartLoaded } from "react-bootstrap-icons";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loadingImage from '../cake.gif'; // Import your loading image

Chartjs.register(plugins)

const Product = () => {
  const [prodList, setProdlist] = useState({});
  const [grndata, setGrndata] = useState();
  const [ytdata, setytdData] = useState();
  const [stock, setStock] = useState();
  const [chart, setChart] = useState();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [loading, setLoading] = useState();
  const [selected, setSelected] = useState();
  const [response, setResponse] = useState();



  useEffect(() => {
    const fetchlist = async () => {
      try {
        const list = await axios.get(`${url.urlb}/prodApi/prodlist`)
        setProdlist(list.data[0].list)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchlist()
  }, [])


  const handleChange = async (options) => {
    let id = options.value;
    setSelected(options.value);
    try {
      const pdata = await axios.get(`${url.urlb}/prodApi/prod/${id}`)
      setGrndata(pdata.data[0].grn)
      setytdData(pdata.data[0].ytd)
      setStock(pdata.data[0].stock)
      setChart(pdata.data[0].yt)
    } catch (error) {
      console.log(error.message)

    }
    setResponse(null)
    // prodData()
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (start > end) {
        toast.error('Start date should be less than end Date..!!');
    } else {
        setLoading(true); 
        try {
            const resp = await axios.post(`${url.urlb}/prodApi/prodsearch`, { start, end, selected });
            setResponse(resp.data);
        } catch (error) {
            console.error('Error fetching data:', error);
  
        } finally {
            setLoading(false); 
        }
    }
};

  return (
    <>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="row mt-2 justify-content-between">
                    <div className="col-sm-6 mt-3">
                      <Select options={prodList} onChange={handleChange} placeholder={<div>Type here to search your product</div>} />
                    </div>
                    {stock ? (
                      <div className='col-sm-4 mt-3'>
                      <h4 className='text-primary'>
                        <MinecartLoaded style={{marginRight : '2px'}}/>  in Hand - 
                        <span className='badge bg-primary text-white' style={{marginLeft : '2px'}}>  {stock[0].qty} - {stock[0].uom} </span>
                      </h4>
                      </div>) : ('')
                    }
                  </div>
                </form>


              </div>
            </div>
          </div>
        </div>
        {ytdata ? (<>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='card'>
                <div className='card-body'>
                  {ytdata ?
                    (<Line data={{
                      labels: chart.map((res) => res.month),
                      datasets: [
                        {
                        label: 'Purchase',
                        data: chart.map((res) => res.purchase),
                        fill: false,
                        borderColor: '#2E4053',
                        tension: 0.5
                        },
                        {
                          label: 'Consumption',
                          data: chart.map((res) => res.consumption),
                          fill: false,
                          borderColor: '#28B463',
                          tension: 0.5
                        }
                      ]
                    }}
                      options={{
                        plugins: {
                          legend: {
                            position: 'top'
                          }
                        },
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            reverse: true,
                            grid: {
                              display: false
                            }
                          },
                        }
                      }}
                    />) : ("")
                  }
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='card'>
                <div className='card-body'>
                  {ytdata ?
                    (<Bar data={{
                      labels: ytdata.map((res) => res.month),
                      datasets: [{
                        label: 'Rate',
                        data: ytdata.map((res) => res.rate),
                        fill: false,
                        backgroundColor: '#fcbb81',
                        borderColor: '#f57402',
                        borderWidth: 1
                      }]
                    }}
                      options={{
                        plugins: {
                          legend: {
                            position: 'top'

                          }
                        },
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            reverse: true,
                            grid: {
                              display: false
                            }
                          },
                        }
                      }}
                    />) : ("")
                  }
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-8'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Recent Purchase</h5>
                  <table className="table table-sm datatable">
                    <thead>
                      <tr>
                        <th scope="col"><small>Supplier Name</small></th>
                        <th scope="col"><small>Del Date</small></th>
                        <th scope="col"><small>Qty</small></th>
                        <th scope="col"><small>Rate</small></th>
                        <th scope="col"><small>Amount</small></th>
                      </tr>
                    </thead>
                    <tbody>
                      {grndata ? (grndata.map(result => (
                        <tr>
                          <td><small>{result.supplier}</small></td>
                          <td className='text-primary'><small>{format(result.delivery_date, 'dd-MM-yyyy')}</small></td>
                          <td><small>{result.qty}</small></td>
                          <td><small>{result.rate}</small></td>
                          <td className='text-end'><small>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(result.total_amt,)}</small></td>
                        </tr>
                      )
                      )) : ("select product")}
                      <tr className='bg-dark text-white'>
                        <td colSpan={4}><strong>Total</strong></td>
                        <td className='text-end'><strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(grndata.reduce((acc, curr) => acc + curr.total_amt, 0))}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* first div end here */}

            {/* Second div start here */} 
            <div className='col-lg-4'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Month Wise</h5>
                  <table className="table table-sm datatable">
                    <thead>
                      <tr>
                        <th scope="col"><small>Month</small></th>
                        <th scope="col"><small>Qty</small></th>
                        <th scope="col"><small>Rate</small></th>
                        <th scope="col"><small>Amount</small></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ytdata ? (ytdata.map(result => (
                        <tr>
                          <td className='text-primary'><small>{result.month}</small></td>
                          <td><small>{result.qty}</small></td>
                          <td><small>{result.rate}</small></td>
                          <td className='text-end'><small>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(result.amt,)}</small></td>
                        </tr>
                      )
                      )) : ("")}
                        <tr className='bg-dark text-white'>
                          <td colSpan={3}><strong>Total</strong></td>
                          <td className='text-end'><strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(ytdata.reduce((acc, curr) => acc + curr.amt, 0))}</strong></td>
                      </tr>
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
                  <div className='d-flex mt-2'>
                    <div className='col-sm-2 m-2'>
                      <input className='form-control' type='date' max={new Date().toJSON().slice(0, 10)} min="2023-04-01" onChange={(e) => setStart(e.target.value)}/>
                    </div>
                    <div className='col-sm-2 m-2'>
                      <input className='form-control' type='date' max={new Date().toJSON().slice(0, 10)} min="2023-04-01" onChange={(e) => setEnd(e.target.value)}/>
                      </div>
                    <button className='btn btn-success m-2' type='submit' onClick={handleSearch}>Search</button>
                  </div>
                </div>
              </div>
              {loading ? 
              <div className='text-center'>
                <img src={loadingImage} alt="Loading..." />
              </div> : response ?
              <div className='card'>
                <div className='card-body'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>Vendor Name</th>
                        <th>GRN No</th>
                        <th>GRN Date</th>
                        <th className='text-center'>Qty</th>
                        <th className='text-center'>Rate</th>
                        <th className='text-end'>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {response.map((res, idx) => (
                        <tr key={idx}>
                          <td>{res.supplier}</td>
                          <td>{res.grn_no}</td>
                          <td>{format(res.delivery_date, 'dd-MM-yyyy')}</td>
                          <td className='text-center'>{res.qty}</td>  
                          <td className='text-center'>{res.rate}</td>  
                          <td className='text-end'>{new Intl.NumberFormat('en-IN',).format(res.amt,)}</td>  
                        </tr>
                      ))}
                      <tr className='bg-dark text-white'>
                        <td colSpan={3}><strong>Total</strong></td>
                        <td className='text-center'><strong>{new Intl.NumberFormat('en-IN',).format(response.reduce((acc, curr) => acc + curr.qty, 0))}</strong></td>
                        <td></td>
                        <td className='text-end'><strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(response.reduce((acc, curr) => acc + curr.amt, 0))}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> : ''}
            </div>
          </div>
        </>) : (
          <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <InfoCircle />
            <span> After selecting Product Name Data will be displayed here...!</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}
        <ToastContainer position="top-right" theme="colored" transition={Bounce} />
      </section>
    </>
  )
}

export default Product