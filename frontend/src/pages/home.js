import React, { useEffect, useState } from 'react';
import { ArrowDownShort, BuildingAdd, CaretUpSquare, Cart2, CurrencyRupee, People } from 'react-bootstrap-icons';
import { Chart as Chartjs, Tooltip, BarElement } from 'chart.js/auto';
import url from '../components/config.json';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import loadingImage from '../cake.gif';

Chartjs.register(Tooltip, BarElement);

const Home = () => {
  const [cardval, setCardval] = useState({
    revenueValue: 0,
    cogsValue: 0,
    labourValue: 0,
    ohValue: 0
  });
  const [projection, setProjection] = useState({
    revenueProj: 0,
    cogsProj: 0,
    labourProj: 0,
    ohProj: 0
  });
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cashPurchase, setCashPurchase] = useState(null);
  const [clientWise, setClientWise] = useState([]);
  const [ytdPurchase, setYtdPurchase] = useState(null);
  const [sitedetails, setSiteDetails] = useState([]);
  const [siteGroup, setSiteGroup] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(`${url.urlb}/api/home`);
        const data = resp.data[0];

        setCardval(prevState => ({
          ...prevState,
          cogsValue: data.card.find(item => item.projectiontype === 'COGS').sum,
          labourValue: data.card.find(item => item.projectiontype === 'Labour').sum,
          revenueValue: data.card.find(item => item.projectiontype === 'Revenue').sum,
          ohValue: data.card.find(item => item.projectiontype === 'OH').sum
        }));

        setProjection(prev => ({
          ...prev,
          cogsProj: data.proj.find(item => item.projectiontype === 'COGS').sum,
          labourProj: data.proj.find(item => item.projectiontype === 'Labour').sum,
          revenueProj: data.proj.find(item => item.projectiontype === 'Revenue').sum,
          ohProj: data.proj.find(item => item.projectiontype === 'OH').sum
        }))

        if (data.chart.length > 0) {
          const rev = data.chart.filter(item => item.projectiontype === 'Revenue');
          const cog = data.chart.filter(item => item.projectiontype === 'COGS');
          const lab = data.chart.filter(item => item.projectiontype === 'Labour');
          const oh = data.chart.filter(item => item.projectiontype === 'OH');
          setChartData({
            labels: rev.map(res => res.month),
            datasets: [
              {
                label: 'Revenue',
                data: rev.map(res => res.sum_amount),
                backgroundColor: 'rgba(233, 114, 77, 0.6)',
                borderColor: 'rgba(233, 114, 77, 1)',
                borderWidth: 1
              },
              {
                label: 'COGS',
                data: cog.map(res => res.sum_amount),
                backgroundColor: 'rgba(121, 204, 179, 0.6)',
                borderColor: 'rgba(121, 204, 179, 1)',
                borderWidth: 1
              },
              {
                label: 'Labour',
                data: lab.map(res => res.sum_amount),
                backgroundColor: 'rgba(146, 202, 209, 0.6)',
                borderColor: 'rgba(146, 202, 209, 1)',
                borderWidth: 1
              },
              {
                label: 'OH',
                data: oh.map(res => res.sum_amount),
                backgroundColor: 'rgba(134, 134, 134, 0.6)',
                borderColor: 'rgba(134, 134, 134, 1)',
                borderWidth: 1
              }
            ]
          });
        }
        setSiteDetails(data.site);
        setClientWise(data.client);
        if (data.cash.length > 0) {
          setCashPurchase({
            labels: data.cash.map(res => res.month),
            datasets: [{
              label: 'Month Wise',
              data: data.cash.map(res => res.total),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: 0.5
            }]
          });
        }

        if (data.ytd.length > 0) {
          setYtdPurchase({
            labels: data.ytd.map(res => res.month),
            datasets: [{
              label: 'Recent 12 Months',
              data: data.ytd.map(res => res.total),
              backgroundColor: '#FF5733'
            }]
          });
        }
        setLoading(false);
      } catch (error) {
        console.log('Error fetching data', error);
      }
    };
    fetchData();

  }, []);

  const handelSite = (e) => {
    setSiteGroup(e.target.value)
  }

  const selSite = siteGroup ? sitedetails.filter(cl => cl.group === siteGroup) : '';
  let totalPnl = 0;
  const formatNumber = (number) => new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 8 }).format(number);

  //const currencyFormat = (number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(number);

  const options = {
    locale: 'en-IN',

  };


  return (
    <>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <section className="section dashboard">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                {/* Revenue Card */}
                <div className="col-xxl-6 col-md-6">
                  <div className="card info-card revenue-card">
                    <div className="card-body">
                      <h5 className="card-title">Revenue <span>| Previous Month</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <CurrencyRupee />
                        </div>
                        <div className="ps-5">
                          <h6>₹ {formatNumber(cardval.revenueValue * -1)}</h6>
                          <span className="text-success small pt-1 fw-bold">
                            {formatNumber(projection.revenueProj)}
                          </span>
                          <span className="text-muted small pt-2 ps-1">Projected Revenue</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Revenue Card */}

                {/* COGS Card */}
                <div className="col-xxl-6 col-md-6">
                  <div className="card info-card sales-card">
                    <div className="card-body">
                      <h5 className="card-title">Cost of Goods <span>| Previous Month</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <Cart2 />
                        </div>
                        <div className="ps-5">
                          <h6>₹ {formatNumber(cardval.cogsValue)}</h6>
                          <span className="text-primary small pt-1 fw-bold">
                            {formatNumber(projection.cogsProj)}
                          </span>
                          <span className="text-muted small pt-2 ps-1">Projected Cost of Goods</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End COGS Card */}

                {/* Food Card */}
                <div className="col-xxl-6 col-md-6">
                  <div className="card info-card return-card">
                    <div className="card-body">
                      <h5 className="card-title">Labour <span>| Previous Month</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <People />
                        </div>
                        <div className="ps-5">
                          <h6>{formatNumber(cardval.labourValue)}</h6>
                          <span className="text-danger small pt-1 fw-bold">
                            {formatNumber(projection.labourProj)}
                          </span>
                          <span className="text-muted small pt-2 ps-1">Projected Labour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Food Card */}

                {/* Vendor Count Card */}
                <div className="col-xxl-6 col-md-6">
                  <div className="card info-card customers-card">
                    <div className="card-body">
                      <h5 className="card-title">OverHead <span>| Previous Month</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <BuildingAdd />
                        </div>
                        <div className="ps-3">
                          <h6>{formatNumber(cardval.ohValue)}</h6>
                          <span className="text-danger small pt-1 fw-bold">
                            {formatNumber(projection.ohProj)}
                          </span>
                          <span className="text-muted small pt-2 ps-1">Projected OverHead</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Vendor Count Card */}

                {/* Reports */}
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">P & L <span>/ Trend</span></h5>
                      {chartData && <Bar data={chartData} options={options} />}
                    </div>
                  </div>
                </div>
                {/* End Reports */}

                {/* Cash Purchase */}
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Cash Purchase</h5>
                      {cashPurchase && <Line data={cashPurchase} options={options} />}
                    </div>
                  </div>
                </div>
                {/* End Cash Purchase */}

                {/* YTD Purchase */}
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Uniform Expenses</h5>
                      {ytdPurchase && <Bar data={ytdPurchase} options={options} />}
                    </div>
                  </div>
                </div>
                {/* End YTD Purchase */}


                {/* Recent Purchase */}
                <div className="col-12">
                  <div className="card recent-sales overflow-auto">
                    <div className="card-body">
                      <h5 className="card-title">Client Wise <span>| Profit & Loss Statment</span></h5>
                      <table className="table table-borderless datatable">
                        <thead className='bg-secondary text-white'>
                          <tr>
                            <th scope="col">Client Group</th>
                            <th scope="col" className='text-md-end'>Revenue</th>
                            <th scope="col" className='text-md-end'>COGS</th>
                            <th scope="col" className='text-md-end'>Labour</th>
                            <th scope="col" className='text-md-end'>OverHead</th>
                            <th scope="col" className='text-md-end'>P&L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientWise.map((res, id) => {
                            let pnl = res.rev - res.cogs - res.labour - res.oh;
                            let className = pnl < 0 ? 'text-danger' : 'text-success';
                            let icon = pnl < 0 ? <ArrowDownShort /> : <CaretUpSquare />;

                            return (
                              <tr key={id}>
                                <th scope='row'><button className='btn text-primary' data-bs-toggle="modal" data-bs-target="#staticBackdrop" value={res.name} onClick={handelSite}>{res.name}</button></th>
                                <td className='text-md-end'>{formatNumber(res.rev)}</td>
                                <td className='text-md-end'>{formatNumber(res.cogs)}</td>
                                <td className='text-md-end'>{formatNumber(res.labour)}</td>
                                <td className='text-md-end'>{formatNumber(res.oh)}</td>
                                <td className={`text-md-end ${className}`}>{formatNumber(pnl)} {icon}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* End Recent Purchase */}

                {/* Model to Display site List */}
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Showing Details for Client Group : {siteGroup ? <b>{siteGroup}</b> : ''}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => setSiteGroup(null)}></button>
                      </div>
                      <div className="modal-body">
                        {loading ? <div className='text-center'>
                          <img src={loadingImage} alt="Loading..." />
                        </div> 
                        : sitedetails ?
                          <div className='col-md-12'>
                            <table className='table table-sm table-hover'>
                              <thead>
                                <th>Site Name</th>
                                <th className='text-center'>Revenue</th>
                                <th className='text-center'>COGS</th>
                                <th className='text-center'>Labour</th>
                                <th className='text-center'>OH</th>
                                <th className='text-center'>P & L</th>
                              </thead>
                              <tbody>
                                {selSite ? selSite.map((res, idx) => {
                                  let pnl = res.rev - res.cogs - res.labour - res.oh;
                                  let classN = pnl < 0 ? 'text-danger' : 'text-success';
                                  totalPnl += pnl;
                                  return(
                                  <tr key={idx}>
                                    <td>{res.site}</td>
                                    <td className='text-md-end'>{new Intl.NumberFormat('en-IN',).format(res.rev)}</td>
                                    <td className='text-md-end'>{new Intl.NumberFormat('en-IN',).format(res.cogs)}</td>
                                    <td className='text-md-end'>{new Intl.NumberFormat('en-IN',).format(res.labour)}</td>
                                    <td className='text-md-end'>{new Intl.NumberFormat('en-IN',).format(res.oh)}</td>
                                    <td className={`text-md-end ${classN}`}><b>{new Intl.NumberFormat('en-IN').format(pnl)}</b></td>
                                  </tr>
                                )}) : ''}
                                <tr className='bg-secondary text-white'>
                                  <td><strong>Total</strong></td>
                                  <td className='text-center'><strong>{new Intl.NumberFormat('en-IN').format(selSite ? selSite.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.rev), 0) : 0)}</strong></td>
                                  <td className='text-center'><strong>{new Intl.NumberFormat('en-IN').format(selSite ? selSite.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.cogs), 0) : 0)}</strong></td>
                                  <td className='text-center'><strong>{new Intl.NumberFormat('en-IN').format(selSite ? selSite.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.labour), 0) : 0)}</strong></td>
                                  <td className='text-center'><strong>{new Intl.NumberFormat('en-IN').format(selSite ? selSite.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.oh), 0) : 0)}</strong></td>
                                  <td className='text-center'><strong>{new Intl.NumberFormat('en-IN').format(totalPnl)}</strong></td>
                                  
                                </tr>
                              </tbody>
                            </table>
                          </div> : ''
                        }
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={(e) => setSiteGroup(null)}>Close</button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Model end here */}

              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
