import './App.css';
import { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart'
import { getDatabase, off, onValue, ref, set } from 'firebase/database';
import { initializeApp } from "firebase/app";


//mode
// 0 là thử công
// 1 là tự động

// Derive
// 0 là off
// 1 là on

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOSfQ8xpCcIIckE3oFc7GVtxFdb_nMckg",
  authDomain: "giamsatcanhbaoludemo.firebaseapp.com",
  databaseURL: "https://giamsatcanhbaoludemo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "giamsatcanhbaoludemo",
  storageBucket: "giamsatcanhbaoludemo.appspot.com",
  messagingSenderId: "463083464195",
  appId: "1:463083464195:web:1e03265526dbf1da3f9036",
  measurementId: "G-XGQS1DWQ7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [mucNuoc, setMucNuoc] = useState(0);
  const [luuluongdongchat, setLuuluongdongchat] = useState(0);
  const [tocdodongchay, setTocdodongchay] = useState(0);
  const [tongluuluongnuoc, settongluuluongnuoc] = useState(0);
  const [canhbao, setCanhbao] = useState(0);
  const [shouldRotate, setShouldRotate] = useState(true);
  const [status, setStatus] = useState(0);
  const [device, setDevice] = useState(0);
  // thiết bị
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const dbRef = ref(database, "/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const mode = data.status;
      setStatus(mode);
      setDevice(data.device);
      setMucNuoc(data.Data.Distance);
      setTocdodongchay(data.Data.FlowSpeed);
      setLuuluongdongchat(data.Data.FlowRate);
      settongluuluongnuoc(data.Data.OutputLiquidQuantity);
      setCanhbao(data.CANHBAO);
    
    });
    return () => {
      off(dbRef);
    };
  }, []);

  setTimeout(() => {
    setShouldRotate(false); // Ngăn không cho kim xoay
  }, 3000);

  const handleCLickStatus = () => {
    if (status === 1) {
      set(ref(database, '/status'), 0)
        .then(() => {
          console.log('Giá trị Mode đã được cập nhật thành 0', status);
        })
        .catch((error) => {
          console.error('Lỗi khi cập nhật giá trị Mode:', error);
        });
      setStatus(0); // Mode = 1
    }
    else {
      set(ref(database, '/status'), 1)
        .then(() => {
          console.log('Giá trị Mode đã được cập nhật thành 1', status);
        })
        .catch((error) => {
          console.error('Lỗi khi cập nhật giá trị Mode:', error);
        });
        set(ref(database, '/device'), 0)
        .then(() => {
          console.log('Giá trị Device2 đã được cập nhật thành ' + 0);
        })
        .catch((error) => {
          console.error('Lỗi khi cập nhật giá trị Device:', error);
        });
        setDevice(0);
        setStatus(1); // Mode = 1
    }

  }
  const handleDevice = () => {
    const deviceCurent = device === 0 ? 1 : 0;
    set(ref(database, '/device'), deviceCurent)
      .then(() => {
        console.log('Giá trị Device2 đã được cập nhật thành ' + deviceCurent);
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật giá trị Device:', error);
      });
    setDevice(deviceCurent)
  }
  useEffect(() => {
    var burgerCheckbox = document.getElementById('burger');
    var sidebarElement = document.querySelector('.sidebar');

    function handleCheckboxChange() {
      if (burgerCheckbox.checked) {
        sidebarElement.classList.add('visible');
      } else {
        sidebarElement.classList.remove('visible');
      }
    }

    burgerCheckbox.addEventListener('change', handleCheckboxChange);

    // Hủy đăng ký sự kiện khi component bị unmount
    return () => {
      burgerCheckbox.removeEventListener('change', handleCheckboxChange);
    };
  }, []);
  return (

    <>

      {isOnline === false && <div className="not-internet">
        <img src="/no-internet.jpg" alt="" />

      </div>}

      {
        isOnline === true &&
        <div className="App"
        >

          {/* cảnh báo khẩn cấp */}
          {status === 2 && <div className="urgent">
          </div>}
          {/* -- end cảnh báo khẩn cấp-- */}
          <div className='header'>
            <div className='logo-not-connect'><img src="/no-internet.jpg" alt="" /></div>
            {/* <div className="logo"><img className="logo" src="/logo.jpeg" alt="" /></div> */}
            <div className="title"><h1>HỆ THỐNG <span>IOT</span> GIÁM SÁT <span>CẢNH BÁO</span> LŨ LỤT</h1></div>
            {/* <div className="logo"><img className="logo" src="/logo2.jpg" alt="" /></div> */}
          </div>
          <div className="body">
            <div className="sidebar">
              <h2 className='title-sidebar'>Vùng điều khiển</h2>
              <div className="survivalmode">
                {/* <h2>Chế độ</h2> */}
                <button className="btn" type="button" onClick={handleCLickStatus}>
                  <strong>{status === 0 ?  'Thủ công' : 'Tự động'}</strong>
                  <div id="container-stars">
                    <div id="stars"></div>
                  </div>

                  <div id="glow">
                    <div className="circle"></div>
                    <div className="circle"></div>
                  </div>
                </button>
              </div>

              {status !== 0 &&
                <div className='action'>
                  <div className="card">
                    <div className="card2">
                      <h4 className='title-message'>Chuông thông báo</h4>
                      <div className='btn-control'>
                        <div className="switch-holder">
                          <div className="switch-label">
                            <i className="fa fa-bluetooth-b"></i><span>Relay</span>
                          </div>
                          <div className="switch-toggle">
                            <input type="checkbox" id="bluetooth" onChange={handleDevice} checked={device === 1} />
                            <label htmlFor="bluetooth"></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              <div className='action-mesage'>
                {/* eslint-disable-next-line */}
                <marquee className="message" scrollamount="12"><h3>{status === 1 ?'Hiện tại đang ở chế độ thủ công' :  "Hiện tại đang ở chế độ tự động cảnh báo"}</h3></marquee>
              </div>
              {status === 0 &&
              <div className='notification'>
                {
                  canhbao === 0 ?
                    <h3 className="btn-shine">Tình trạng an toàn</h3>
                    :
                    <div className='canhbao-muc'>
                    <h3 className='title-canhbao'>Có nguy cơ đạt {canhbao === 2 || canhbao === 3 ? 'mức': ''} báo động {canhbao}</h3>
                    {canhbao === 1 && <h3 className='title-canhbao'>khả năng ngập úng cục bộ</h3>}
                    {canhbao === 2 && <h3 className='title-canhbao'>khả năng ngập úng diện rộng</h3>}
                    {canhbao === 3 && <h3 className='title-canhbao'>yêu cầu sơ tán khẩn cấp</h3>}
                    </div>
                    
                }
              </div>
              }
            </div>
            <div className="content">
              <label className="burger" htmlFor="burger">
                <input type="checkbox" id="burger" />
                <span></span>
                <span></span>
                <span></span>
              </label>
              <h2 className='title-content'>Thông số thiết bị</h2>
              {/* ph */}
              <div className='thongso'>
                <GaugeChart id="gauge-chart2"

                  animate={shouldRotate}
                  nrOfLevels={20}
                  percent={mucNuoc / 100}
                  textColor=''
                  needleColor="red"
                  // hideText
                  formatTextValue={() => mucNuoc}
                />
                <h2 className='title-thongso'>Mực nước</h2>

              </div>

              <div className='thongso'>

                <GaugeChart id="gauge-chart2"
                  nrOfLevels={20}
                  animate={shouldRotate}
                  percent={tocdodongchay / 5}
                  formatTextValue={(value) => tocdodongchay}
                  needleColor="red"
                  textColor=''
                />
                <h2 className='title-thongso'>Tốc độ dòng chảy </h2>

              </div>
              <div className='thongso'>

                <GaugeChart id="gauge-chart5"

                  animate={shouldRotate}
                  nrOfLevels={20}
                  colors={['#EA4228', '#F5CD19', '#5BE12C']}
                  percent={luuluongdongchat / 10}
                  needleColor="red"
                  textColor=''
                  formatTextValue={() => luuluongdongchat}
                />
                <h2 className='title-thongso'>Lưu lượng dòng chảy</h2>


              </div>
              <div className='thongso'>

                <GaugeChart id="gauge-chart5"

                  animate={shouldRotate}
                  nrOfLevels={20}
                  colors={['#EA4228', '#F5CD19', '#5BE12C']}
                  percent={tongluuluongnuoc / 15000}
                  arcPadding={0.02}
                  needleColor="red"
                  textColor=''
                  formatTextValue={() => tongluuluongnuoc}
                />
                <h2 className='title-thongso'>Tổng lưu lượng nước</h2>


              </div>
            </div>
          </div>


        </div>}
    </>
  );
}

export default App;
