import React, { useEffect, useState } from 'react'
import { CartCheck, CartDash, CartX, Shop } from 'react-bootstrap-icons'
import { Chart as Chartjs, Tooltip } from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation';
import url from '../components/config.json'
import { Bar, Doughnut } from 'react-chartjs-2'
import axios from 'axios'

Chartjs.register(Tooltip, annotationPlugin);

const Sales = () => {
  const [scard, setScard] = useState();
  const [chartdata, setchartData] = useState([]);
  const [pchart, setPchart] = useState([])
  const [category, setCategory] = useState([])
  const [bar, setBar] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const resp = await axios.get(`${url.urlb}/saleApi/sales`);
        setScard(resp.data[0].scard);
        setCategory(resp.data[0].hchart);
        if (resp.data[0].schart.length > 0) {
          let mini = resp.data[0].schart.map((res) => res.sale)
          setchartData({
            labels: resp.data[0].schart.map((res) => res.month),
            datasets: [{
              label: 'Actual Sale',
              data: resp.data[0].schart.map((res) => res.sale),
              backgroundColor: [
                'rgba(54, 162, 235, 0.2)'
              ],
              borderColor: [
                'rgb(54, 162, 235)'
              ],
              borderWidth: 1
            },
            {
              label: 'Return',
              data: resp.data[0].schart.map((res) => res.return),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)'
              ],
              borderWidth: 1
            },
            ]
          });
          setBar({
            maintainAspectRatio: true,
            locale: 'en-IN',
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              }
            },
            plugins: {
              annotation: {
                annotations:
                {
                  line1: {
                    type: 'line',
                    yMin: Math.min(...mini),
                    yMax: Math.min(...mini),
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2,
                    label: {
                      content: 'Minimum Sale Value'
                    }
                  }
                },
              },
            },
          }
          )
        }
        if (resp.data[0].pchart.length > 0) {
          setPchart({
            labels: resp.data[0].pchart.map((res) => res.bcategory),
            datasets: [
              {
                label: 'Sale',
                data: resp.data[0].pchart.map((res) => res.sale),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              }
            ]
          })
        }
        setLoading(false);

      } catch (error) {
        console.log('error fetching data', error);
      }
    };
    fetchdata();

  }, [])


  return (
    <>
      {loading ? (<h3>loading.....</h3>) : (
        <section className="section dashboard">
          <div className="row">

            {/* <!-- Left side columns --> */}
            <div className="col-lg-12">
              <div className="row">

                {/* <!-- NonFood Card --> */}
                <div className="col-xxl-3 col-md-3">
                  <div className="card info-card sales-card">
                    <div className="card-body">
                      <h5 className="card-title">Order Amount <span>| {scard[0].month}</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <CartDash />
                        </div>
                        <div className="ps-3">
                          <h6>{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 8 }).format(scard[0].order,)}</h6>
                          {/* <span className="text-success small pt-1 fw-bold">{Math.round(result[0].sum / (result[0].sum + result[1].sum) * 100) + '%'}</span> <span className="text-muted small pt-2 ps-1">of Total Procurment</span> */}

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                {/* <!-- End Non Food Card --> */}

                {/* <!-- Food Card --> */}
                <div className="col-xxl-3 col-md-3">
                  <div className="card info-card return-card">
                    <div className="card-body">
                      <h5 className="card-title">Return Amount <span>| {scard[0].month}</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <CartX />
                        </div>
                        <div className="ps-3">
                          <h6>{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 8 }).format(scard[0].return,)}</h6>
                          <span className="text-danger small pt-1 fw-bold">{Math.round(scard[0].return / scard[0].order * 100) + '%'}</span> <span className="text-muted small pt-2 ps-1">of Order Value</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                {/* <!-- End Food Card --> */}

                {/* <!-- Food Card --> */}
                <div className="col-xxl-3 col-md-3">
                  <div className="card info-card revenue-card">
                    <div className="card-body">
                      <h5 className="card-title">Actual Sale <span>| {scard[0].month}</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-currency-dollar"></i>
                          <CartCheck />
                        </div>
                        <div className="ps-3">
                          <h6>{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 8 }).format(scard[0].sale,)}</h6>
                          {/* <span className="text-success small pt-1 fw-bold">{Math.round(result[1].sum / (result[0].sum + result[1].sum) * 100) + '%'}</span> <span className="text-muted small pt-2 ps-1">of Total Procurment</span> */}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                {/* <!-- End Sales Card --> */}

                {/* <!-- Vendor Count Card --> */}
                <div className="col-xxl-3 col-md-3">
                  <div className="card info-card customers-card">
                    <div className="card-body">
                      <h5 className="card-title">Shop Count <span>| {scard[0].month}</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <Shop />
                        </div>
                        <div className="ps-3">
                          <h6>{scard[0].count}</h6>
                          <span className="text-danger small pt-1 fw-bold"></span> <span className="text-muted small pt-2 ps-1">Customers</span>

                        </div>
                      </div>

                    </div>
                  </div>

                </div>
                {/* <!-- End Vendor Count Card --> */}

                {/* <!-- Reports --> */}
                <div className="col-12">
                  <div className="card">

                    <div className="card-body">
                      <h5 className="card-title">YTD Sales <span>/Trend</span></h5>
                      <Bar data={chartdata} options={bar} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">

                    <div className="card-body">
                      <h5 className="card-title">Business <span>/ Category</span></h5>
                      <Doughnut data={pchart} options={{ locale: 'en-IN' }} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Product <span>/ Category</span></h5>
                      <table className='table table-sm table-hover'>
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Sale</th>
                            <th>Return</th>
                            <th>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.map((res, idx) => (
                            <tr key={idx}>
                              <td><small>{res.cat}</small></td>
                              <td className='text-end'><small>{new Intl.NumberFormat('en-IN').format(res.sale,)}</small></td>
                              <td className='text-end'><small>{new Intl.NumberFormat('en-IN').format(res.return,)}</small></td>
                              <td className={(res.return / res.sale * 100) > 5 ? 'text-center text-danger' : 'text-center'}>{Math.round(res.return / res.sale * 100, 2) + '%'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- End Left side columns --> */}
          </div>
        </section>
      )}

    </>
  )
}

export default Sales