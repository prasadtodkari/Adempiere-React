import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Select from 'react-select'
import { format } from 'date-fns'
import url from '../components/config.json'
import { InfoCircle } from "react-bootstrap-icons";
import loadingImage from '../cake.gif';

function Vendor() {
  const [vlist, setVlist] = useState({})
  const [grnd, setGrndata] = useState()
  const [vytd, setVytd] = useState()
  const [mdata, setMdata] = useState()
  const [selectedItems, setSelectedItems] = useState([]);
  const [grnno, setGrnno] = useState();
  const [grndata, setGrnda] = useState();
  const [loading, setLoading] = useState(false)
  

  useEffect(() => {
    const fetchlist = async () => {
      try {
        const clist = await axios.get(`${url.urlb}/vendApi/vend`)
        setVlist(clist.data[0].clist)
        
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchlist()
  }, [])
  
  const handleVChange = async (options) => {
    let id = options.value;
    try {
      const gdata = await axios.get(`${url.urlb}/vendApi/vendr/${id}`)
      setGrndata(gdata.data[0].grnd)
      setVytd(gdata.data[0].vytd)
      setMdata(gdata.data[0].material)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleCheckboxChange = (event, res) => {
    const { checked, value } = event.target;
    if (checked) {
      setSelectedItems([...selectedItems, { value: value, amount: res.round }]);
    } else {
      setSelectedItems(selectedItems.filter(item => item.value !== value));
    }
  };
  const handelGRN = async (e) => {
    setGrnno(e.target.value);
    let id = e.target.value
    setLoading(true);
    try {
      const grndata = await axios.get(`${url.urlb}/vendApi/vendor/${id}`)
      setGrnda(grndata.data);
      
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false)
  }

  const calculateSum = () => {
    return selectedItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  };

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
                      <h5 className='card-title'>Select Vendor Name</h5>
                    </div>
                    <div className="col-sm-6 mt-3">
                      <Select options={vlist} onChange={handleVChange} placeholder={<div>Search Vendor Here</div>}/>
                    </div>
                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>
        { grnd ? ( 
          <div className='row'>
            <div className='col-md-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>Recent GRN Details</h5>
                <table className='table table-sm'>
                  <thead>
                    <tr>
                      <th></th>
                      <th>GRN No</th>
                      <th>GRN Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grnd.map((res, idx) => (
                    <tr key={idx}>
                      <td><input type='checkBox' value={res.round} onChange={e => handleCheckboxChange(e, res)}></input></td>
                      <td><button className='btn text-primary' data-bs-toggle="modal" data-bs-target="#staticBackdrop" value={res.grn_no} onClick={handelGRN}>{res.grn_no}</button></td>
                      <td>{format(res.receiving_date, 'dd-MM-yyyy')}</td>
                      <td className='text-end'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(res.round,)}</td>
                    </tr>
                    ))}
                    {calculateSum() > 0  ? 
                    <tr className='bg-dark text-white'>
                      <td colSpan={3}>Total of Selected :</td>
                      <td className='text-end'><strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(calculateSum())}</strong></td>
                    </tr> : ''
                    }
                  </tbody>
                </table>
              </div>
              </div>
            </div>
            {/* first div end here */}
            <div className='col-md-3'>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>YTD Purchase Details</h5>
                  <table className='table table-sm table-hover'>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th className='text-end'>Amount</th>
                      </tr>
                    </thead>
                    <tbody> 
                      {vytd.map(res => (  
                        <tr>
                          <td>{res.month}</td>
                          <td className='text-end'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(res.amt,)}</td>
                        </tr>
                      ))}
                       <tr className='bg-dark text-white'>
                        <td ><strong>Total</strong></td>
                        <td className='text-end'><strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(vytd.reduce((acc, curr) => acc + curr.amt, 0))}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* end second div */}
            <div className='col-md-5'>
              <div className='card'>
                <div className='card-body table-responsive'>
                  <h5 className='card-title'>Product Supplied</h5>
                  <table className='table table-sm table-hover'>
                    <thead>
                      <tr>
                        <th><small>Product Name</small></th>
                        <th><small>Avg Qty</small></th>
                        <th><small>Avg Rate</small></th>
                        <th><small>Avg Amount</small></th>
                      </tr>
                    </thead>
                    <tbody>
                      {mdata.map(result => (
                        <tr>
                          <td className='text-danger'><small>{result.material}</small></td>
                          <td><small>{result.avg}</small></td>
                          <td>{result.round}</td>
                          <td className='text-end'>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(result.amt,)}</td>
                        </tr>
                      ))}
                      <tr className='bg-dark text-white'>
                        <td colSpan={3}><strong>Total</strong></td>
                        <td className='text-end'><strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(mdata.reduce((acc, curr) => acc + curr.amt, 0))}</strong></td>
                      </tr>
                    </tbody>                 
                  </table>
                </div>
              </div>
            </div>          
          
          <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">Showing Details for GRN : {grnno ? grnno : ''}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => setGrnno(null)}></button>
                </div>
                <div className="modal-body">
                  {loading ? <div className='text-center'>
                <img src={loadingImage} alt="Loading..." />
              </div> : grndata ? 
              <div className='col-md-12'>
                <table className='table table-sm table-hover'>
                  <thead>
                    <th>Product Name</th>
                    <th className='text-center'>Qty</th>
                    <th className='text-center'>Rate</th> 
                    <th className='text-center'>tax Amt</th> 
                    <th className='text-center'>Total Amt</th> 
                  </thead>
                  <tbody>
                    {grndata.map((res, idx) => (
                      <tr key={idx}>
                        <td>{res.material}</td>
                        <td className='text-center'>{res.qty}</td>
                        <td className='text-center'>{res.rate}</td>
                        <td className='text-center'>{new Intl.NumberFormat('en-IN',).format(res.taxamount)}</td>
                        <td className='text-center'>{new Intl.NumberFormat('en-IN',).format(res.total_amt)}</td> 
                      </tr>
                    ))}
                    <tr className='bg-secondary text-white'>
                        <td colSpan={4}><strong>Total</strong></td>
                        <td className='text-center'><strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(grndata.reduce((acc, curr) => acc + curr.total_amt, 0))}</strong></td>
                      </tr>
                  </tbody>
                </table>
              </div> : ''
                }
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={(e) => setGrnno(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>

          </div>         
        ) : (
          <div className="alert alert-info alert-dismissible fade show" role="alert">
            <InfoCircle />
              <span> After selecting Vendor Name Data will be displayed here...!</span>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )

        }
      </section>
    </>
  )
}

export default Vendor