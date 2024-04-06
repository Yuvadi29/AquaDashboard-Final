import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js/auto';
import { Toast } from 'react-bootstrap';
import '../css/prediction.css';
import logo from '../images/logo.png';


const WaterQualityAnalysis = () => {
  const [temp1, setTemp1] = useState(0);
  const [temp2, setTemp2] = useState(0);
  const [temp3, setTemp3] = useState(0);
  const [ph1, setPh1] = useState(0);
  const [ph2, setPh2] = useState(0);
  const [ph3, setPh3] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const [button1State, setButton1State] = useState(0);
  const [button2State, setButton2State] = useState(0);
  const [button3State, setButton3State] = useState(0);

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const containerClasses = `flex h-screen bg-gray-800 ${isSideMenuOpen ? 'overflow-hidden' : ''}`;
  const [isOpen, setIsOpen] = useState(false);

  const toggleButton1 = () => {
    const newState = button1State === 0 ? 1 : 0;
    setButton1State(newState);
    updateButtonState(1, newState);
  };

  const toggleButton2 = () => {
    const newState = button2State === 0 ? 1 : 0;
    setButton2State(newState);
    updateButtonState(2, newState);
  };

  const toggleButton3 = () => {
    const newState = button3State === 0 ? 1 : 0;
    setButton3State(newState);
    updateButtonState(3, newState);
  };

  const updateButtonState = (buttonNumber, newState) => {
    const token = 'WfQITWPhO1JeF3zrRGXvt09vi14Ekms-';

    fetch(`https://blynk.cloud/external/api/update?token=${token}&v${buttonNumber}=${newState}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(`Button ${buttonNumber} state updated to ${newState}`);
      })
      .catch((error) => {
        console.error(`Error updating button state for Button ${buttonNumber}: ${error}`);
      });
  };

  let myChart;

  const fetchData = async () => {
    try {
      // Temperature Data Stream
      const response1 = await fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v1');
      const response2 = await fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v4');
      const response3 = await fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v7');


      // PH Data Stream
      const response4 = await fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v2');
      const response5 = await fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v5');
      const response6 = await fetch('https://blynk.cloud/external/api/get?token=WfQITWPhO1JeF3zrRGXvt09vi14Ekms-&v8');

      const data1 = await response1.json();
      const data2 = await response2.json();
      const data3 = await response3.json();

      const data4 = await response4.json();
      const data5 = await response5.json();
      const data6 = await response6.json();

      setTemp1(data1);
      setTemp2(data2);
      setTemp3(data3);

      setPh1(data4);
      setPh2(data5);
      setPh3(data6);

      console.log("Temp Sensor 1 Data: ", data1);
      console.log("Temp Sensor 2 Data: ", data2);
      console.log("Temp Sensor 3 Data: ", data3);


      console.log("pH Sensor 4 Data: ", data4);
      console.log("pH Sensor 5 Data: ", data5);
      console.log("pH Sensor 6 Data: ", data6);
      // updateChart(data1, data2);
      updateChart(data1, data2, data3, data4, data5, data6);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const updateChart = (data1, data2, data3, data4, data5, data6) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const maxDataPoints = 15;

    if (myChart) {
      // If chart exists, update the data
      if (myChart.data.labels.length >= maxDataPoints) {
        myChart.data.labels.shift(); // Remove the first label
        myChart.data.datasets.forEach(dataset => {
          dataset.data.shift(); // Remove the first data point from each dataset
        });
      }
      myChart.data.labels.push(new Date().toLocaleTimeString());
      myChart.data.datasets[0].data.push(data1);
      myChart.data.datasets[1].data.push(data2);
      myChart.data.datasets[2].data.push(data3);
      myChart.data.datasets[3].data.push(data4);
      myChart.data.datasets[4].data.push(data5);
      myChart.data.datasets[5].data.push(data6);
      myChart.update();
    } else {
      // If chart does not exist, create it with initial data
      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [new Date().toLocaleTimeString()],
          datasets: [{
            label: 'Temperature Sensor 1',
            data: [data1],
            fill: false,
            borderColor: 'rgba(255, 26, 104, 1)',
            backgroundColor: 'rgba(255, 26, 104, 0.2)',
            borderWidth: 1
          }, {
            label: 'Temperature Sensor 2',
            data: [data2],
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1
          }, {
            label: 'Temperature Sensor 3',
            data: [data3],
            fill: false,
            borderColor: 'rgb(240, 25, 245)',
            backgroundColor: 'rgb(182, 162, 235)',
            borderWidth: 1
          }, {
            label: 'pH Sensor 1',
            data: [data4],
            fill: false,
            borderColor: 'rgb(52, 168, 83)',
            backgroundColor: 'rgb(255, 214, 102)',
            borderWidth: 1
          },
          {
            label: 'pH Sensor 2',
            data: [data5],
            fill: false,
            borderColor: 'rgb(255, 99, 71)',
            backgroundColor: 'rgb(30, 144, 255)',
            borderWidth: 1
          },
          {
            label: 'pH Sensor 3',
            data: [data6],
            fill: false,
            borderColor: 'rgb(255, 165, 0)',
            backgroundColor: 'rgb(119, 136, 153)',
            borderWidth: 1
          },
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              min: 20,
              max: 40,
            }
          },
          animation: {
            duration: 0 // No animation to make the update instant
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 2000); // Fetch data every 10 seconds

    return () => clearInterval(interval);
  }, []);


  const checkIsWaterDrinkable = (temperatureValue) => {
    if (temperatureValue > 25 && temperatureValue < 32) {
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };
  return (
    <>
      <div className={containerClasses}>
        {/* SideBar */}
        <aside className='z-20 flex-shrink-0 hidden w-60 pl-2 overflow-y-auto bg-gray-800 md:block'>
          <div>
            <div className="text-white">
              <div className="flex p-2 bg-gray-800">
                <div className="flex py-3 px-2 items-center">
                  <p className="ml-2 font-semibold italic">DASHBOARD</p>
                </div>
              </div>
              <div className="flex justify-center">
                <div>
                  <img src={logo} alt="img" className='hidden h-24 w-24 rounded-full sm:block object-cover mr-2 border-4 border-green-400' />
                  <p className="font-bold text-base text-gray-400 pt-2 text-center w-24">AquaShrimp</p>
                </div>
              </div>
              <div>
                <ul className="mt-6 leading-10">
                  <li className="relative px-2 py-1">
                    <a className="inline-flex items-center w-full text-sm font-semibold text-white transition-colors duration-150 cursor-pointer hover:text-green-500"
                      href="/">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="ml-4">Mesh Network</span>
                    </a>
                    <a className="inline-flex items-center w-full text-sm font-semibold text-white transition-colors duration-150 cursor-pointer hover:text-green-500"
                      href="/single-node">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="ml-4">Single Node Network</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
        <div className="flex flex-col flex-1 w-full overflow-y-auto">
          <header className="z-40 py-4  bg-gray-800  ">
            <div className="flex items-center justify-between h-8 px-6 mx-auto">
              <div className="flex justify-center  mt-2 mr-4">
                <div className="relative flex w-full flex-wrap items-stretch mb-3">
                  <input type="search" placeholder="Search"
                    className="form-input px-3 py-2 placeholder-gray-400 text-gray-700 relative bg-white rounded-lg text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pr-10" />
                  <span
                    className="z-10 h-full leading-snug font-normal  text-center text-gray-400 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -mt-1" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </header>


          <main className="">
            <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 border-green-400">
              <div className="grid grid-cols-12 gap-6">
                <div className="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
                  <div className="col-span-12 mt-8">
                    <div className="flex items-center h-10 intro-y">
                      <h2 className="mr-5 text-lg font-medium truncate">Dashboard of our IOT System</h2>
                    </div>
                    <div className="grid grid-cols-12 gap-6 mt-5">

                      {/* Temperature 1 */}
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 12 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a2 2 0 00-2 2v12a2 2 0 001 1.732V18a2 2 0 11-2 0v-1.268A2 2 0 007 16V4a2 2 0 114 0v12a2 2 0 001.732 1h.536A2 2 0 0015 16V4a2 2 0 00-2-2z" />
                            </svg>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">{temp1}</div>

                              <div className="mt-1 text-base text-gray-600">Temperature Sensor 1</div>
                            </div>
                          </div>
                        </div>
                      </a>

                      {/* Temperature 2*/}
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 12 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a2 2 0 00-2 2v12a2 2 0 001 1.732V18a2 2 0 11-2 0v-1.268A2 2 0 007 16V4a2 2 0 114 0v12a2 2 0 001.732 1h.536A2 2 0 0015 16V4a2 2 0 00-2-2z" />
                            </svg>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">{temp2}</div>

                              <div className="mt-1 text-base text-gray-600">Temperature Sensor 2</div>
                            </div>
                          </div>
                        </div>
                      </a>

                      {/* Temperature 3 */}
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 12 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a2 2 0 00-2 2v12a2 2 0 001 1.732V18a2 2 0 11-2 0v-1.268A2 2 0 007 16V4a2 2 0 114 0v12a2 2 0 001.732 1h.536A2 2 0 0015 16V4a2 2 0 00-2-2z" />
                            </svg>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">{temp3}</div>

                              <div className="mt-1 text-base text-gray-600">Temperature Sensor 3</div>
                            </div>
                          </div>
                        </div>
                      </a>

                      <br />

                      {/* pH Sensor 1 */}
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 12 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a2 2 0 00-2 2v12a2 2 0 001 1.732V18a2 2 0 11-2 0v-1.268A2 2 0 007 16V4a2 2 0 114 0v12a2 2 0 001.732 1h.536A2 2 0 0015 16V4a2 2 0 00-2-2z" />
                            </svg>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">{ph1}</div>

                              <div className="mt-1 text-base text-gray-600">pH Sensor 1</div>
                            </div>
                          </div>
                        </div>
                      </a>

                      {/* pH Senor 2 */}
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 12 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a2 2 0 00-2 2v12a2 2 0 001 1.732V18a2 2 0 11-2 0v-1.268A2 2 0 007 16V4a2 2 0 114 0v12a2 2 0 001.732 1h.536A2 2 0 0015 16V4a2 2 0 00-2-2z" />
                            </svg>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">{ph2}</div>

                              <div className="mt-1 text-base text-gray-600">pH Sensor 2</div>
                            </div>
                          </div>
                        </div>
                      </a>

                      {/* pH Sensor 3 */}
                      <a className="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                        href="#">
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 12 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a2 2 0 00-2 2v12a2 2 0 001 1.732V18a2 2 0 11-2 0v-1.268A2 2 0 007 16V4a2 2 0 114 0v12a2 2 0 001.732 1h.536A2 2 0 0015 16V4a2 2 0 00-2-2z" />
                            </svg>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-3 text-3xl font-bold leading-8">{ph3}</div>

                              <div className="mt-1 text-base text-gray-600">pH Sensor 3</div>
                            </div>
                          </div>
                        </div>
                      </a>

                      <br />
                      {/* Button 1 */}
                      <a className={`cursor-pointer transform hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white ${button1State === 1 ? 'bg-green-500' : 'bg-red-500'}`} onClick={toggleButton1}>
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-7 w-7">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 -7v14" />
                            </svg>
                            <div className={`rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm ${button1State === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                              <span className="flex items-center">{button1State === 1 ? 'ON' : 'OFF'}</span>
                            </div>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-1 text-4xl text-gray-600">Button 1</div>
                            </div>
                          </div>
                        </div>
                      </a>

                      {/* Button 2 */}
                      <a className={` cursor-pointer transform hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white ${button2State === 1 ? 'bg-green-500' : 'bg-red-500'}`} onClick={toggleButton2}>
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-7 w-7">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 -7v14" />
                            </svg>
                            <div className={`rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm ${button2State === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                              <span className="flex items-center">{button2State === 1 ? 'ON' : 'OFF'}</span>
                            </div>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-1 text-4xl text-gray-600">Button 2</div>
                            </div>
                          </div>
                        </div>
                      </a>

                      {/* Button 3 */}
                      <a className={` cursor-pointer transform hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white ${button2State === 1 ? 'bg-green-500' : 'bg-red-500'}`} onClick={toggleButton3}>
                        <div className="p-5">
                          <div className="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-7 w-7">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 -7v14" />
                            </svg>
                            <div className={`rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm ${button3State === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                              <span className="flex items-center">{button3State === 1 ? 'ON' : 'OFF'}</span>
                            </div>
                          </div>
                          <div className="ml-2 w-full flex-1">
                            <div>
                              <div className="mt-1 text-4xl text-gray-600">Button 3</div>
                            </div>
                          </div>
                        </div>
                      </a>

                    </div>
                  </div>
                  <div className="col-span-12 mt-5">
                    <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
                      <canvas id="myChart" width="400" height="200"></canvas>
                      <div id="chartVersion"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div >
      {/* </div> */}
    </>
  );
}

export default WaterQualityAnalysis;