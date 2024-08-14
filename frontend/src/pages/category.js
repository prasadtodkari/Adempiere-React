
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import url from '../components/config.json'

function Category() {
  const [cate, setCate] = useState();
  const months = () => {
    const headers = [];
    const currentDate = new Date();
    
    // Generate headers for the last 12 months
    for (let i = 0; i < 13; i++) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear();
      const date = new Date(year, month, 1);
      const header = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      headers.unshift(header); // Add headers in reverse order
    }
    
    return headers;
  };

  //store table head
  const tableHead = () =>{
    const head = months();
    return head.map((header, idx) => <th key={idx}>{header}</th>)
  }

  useEffect(() => {
    const fetchdata = async () => {
      const datalist = await axios.get(`${url.urlb}/prodApi/category`)
      setCate(datalist.data)
    }
    fetchdata();
  }, [])

  console.log(cate);
  
  return (
    <div content='containercontainer-fluid'>
      <div className='row'>
    <div className='row'>
      <div className='col-auto'>
        <div className='card'>
          <div className='card-body overflow-auto'>
          <h5 className='card-title'>Category Wise Purchase Trend</h5>
            <table className='table table-sm table-bordered table-responsive'>
              <thead>
                <tr style={{fontSize: '90%'}}>
                  <th>Category</th>
                  {tableHead()}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cate ? cate.map((dat, idx) => (
                  <tr key={idx} style={{fontSize: '90%'}}>
                    <td >{dat.subcategory}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.a)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.b)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.c)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.d)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.e)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.f)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.g)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.h)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.i)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.j)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.k)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.l)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.m)}</td>
                    <td className='text-end'>{new Intl.NumberFormat('en-IN').format(dat.total)}</td>
                  </tr>
                )) : ''}
                { cate ? 
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.a, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.b, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.c, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.d, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.e, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.f, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.g, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.h, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.i, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.j, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.k, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.l, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.m, 0))}</strong></td>
                  <td><strong>{new Intl.NumberFormat('en-IN', ).format(cate.reduce((acc, curr) => acc + curr.total, 0))}</strong></td>
                </tr>
                : []}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Category