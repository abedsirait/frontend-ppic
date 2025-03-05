import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom';

const ProductionDashboard = () => {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [expire, setExpire] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState('');

  const navigate = useNavigate();

  const [production, setProduction] = useState([]);
    
    useEffect(() => {
        refreshToken();
        getProduction();
    }, []);
    
    
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use (async(config)=>{
      const currentDate = new Date();
      if(expire *1000 < currentDate.getTime()){
        const response = await axios.get(`${process.env.REACT_APP_API_URL}token`);
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decodedToken = jwtDecode(response.data.accessToken);
        setRole(decodedToken.role);
        setExpire(decodedToken.exp);
      }
      return config;
    },(error)=>{
      return Promise.reject(error);
    })

    const getProduction = async () => {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}production`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const sortedData = response.data.sort((a, b) => b.id - a.id);

        setProduction(sortedData);
    }


    const refreshToken = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}token`);
            setToken(response.data.accessToken);
            const decodedToken = jwtDecode(response.data.accessToken);
            setRole(decodedToken.role);
            setExpire(decodedToken.exp);
        } catch (error) {
            if(error.response){
              navigate('/');
            }
        }
    }

    const formatDate = (isoDate) => {
      return new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
      }).format(new Date(isoDate));
  };

  const formatDateCreate = (isoDate) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Gunakan format 24 jam
      timeZone: "Asia/Jakarta" // Pastikan sesuai zona waktu Indonesia
    }).format(new Date(isoDate));
};

const deleteProduction = async (id) => {
  try {
    await axiosJWT.delete(`${process.env.REACT_APP_API_URL}production/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    getProduction();
  } catch (error) { 
    console.log(error);
  }
}
const isOlderThanTwoDays = (createdAt) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffTime = Math.abs(now - createdDate);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays > 2;
    };

    const handleRequestEdit = (id) => {
      setSelectedId(id);
      setShowPopup(true);
  };
  
  const sendEditRequest = async () => {
    if (!reason) {
        alert("Harap masukkan alasan request edit.");
        return;
    }

    try {
        await axiosJWT.post(`${process.env.REACT_APP_API_URL}production/request-edit`, {
            productionId: selectedId,
            reason: reason
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        alert("Permintaan edit telah dikirim.");
        setShowPopup(false);
        setReason('');
    } catch (error) {
        console.log(error);
        alert("Gagal mengirim permintaan edit.");
    }
};

  return (
    <div className='container mt-5 is-centered'>
      <div className='columns is-half'>
          <table className='table is-striped is-fullwidth'>
            <thead>
              <tr>
                <th colSpan="15" className="has-text-right">
                  <Link to="/production/add" className="button is-primary">Add New Data</Link>
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Category</th>
                <th>Machine</th>
                <th>Product Name</th>
                <th>Label</th>
                <th>Detail Label</th>
                <th>Date</th>
                <th>Supervisor</th>
                <th>Operator</th>
                <th>Total Jam</th>
                <th>Tonase</th>
                <th>Keterangan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {production.map((production, index) => (
                <tr key={production.id}>
                <td>{index + 1}</td>
                <td>{production.kategori}</td>
                <td>{production.mesin}</td>
                <td>{production.namaproduk}</td>
                <td>{production.labelumum}</td>
                <td><Link to={`/production/details/${production.id}`} type='button' className='button is-small is-info'>Details</Link></td>
                <td>{formatDate(production.tanggal)}</td>
                <td>{production.supervisor}</td>
                <td>{production.operator1}, {production.operator2}, {production.operator3}</td>
                <td>{production.totaljam}</td>
                <td>{production.tonase}</td>
                <td>{[production.keterangan, production.penyebabKarantina, production.keteranganKarantina]
                    .filter(value => value && value.trim() !== "")
                    .join(", ")}
                </td>
                <td>
                  {isOlderThanTwoDays(production.createdAt) ? (
                    <button className='button is-small is-warning mr-2' onClick={() => handleRequestEdit(production.id)}> Request Edit </button>) : (
                      <>
                         <Link to={`/production/edit/${production.id}`} className='button is-small is-info mb-2'>Edit</Link>
                    <button onClick={() => deleteProduction(production.id)} className='button is-small is-danger'> Delete</button>
                      </>
                    )}
                </td>
              </tr>
              ))}
            </tbody>
          </table>
      </div>
      {showPopup && (
                <div className="modal is-active">
                    <div className="modal-background" onClick={() => setShowPopup(false)}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Request Edit</p>
                            <button className="delete" onClick={() => setShowPopup(false)}></button>
                        </header>
                        <section className="modal-card-body">
                            <textarea
                                className="textarea"
                                placeholder="Masukkan alasan request edit..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            ></textarea>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-success mr-5" onClick={sendEditRequest}>Send Request</button>
                            <button className="button" onClick={() => setShowPopup(false)}>Cancel</button>
                        </footer>
                    </div>
                </div>
            )}
    </div>
  )
}

export default ProductionDashboard
