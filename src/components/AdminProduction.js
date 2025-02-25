import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom';

const AdminProductionDashboard = () => {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [expire, setExpire] = useState('');
  const [editRequests, setEditRequests] = useState([]);
  const navigate = useNavigate();

  const [production, setProduction] = useState([]);
    
    useEffect(() => {
        refreshToken();
        getProduction();
        getEditRequests();
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
        setProduction(response.data);
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


const exportProductionResults = async () =>{
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}export/production`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "production_data.xlsx";
  link.click();


  window.URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
} catch (error) {
  console.error("Export failed:", error);
}
};

const getEditRequests = async () => {
  try {
      const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}admin/production/request-edit`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      setEditRequests(response.data);
  } catch (error) {
      console.log("Gagal mendapatkan request edit:", error);
  }
};

const resolveEditRequest = async (id) => {
  try {
      await axiosJWT.patch(`${process.env.REACT_APP_API_URL}admin/production/request-edit/${id}`, {}, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      alert("Request edit telah ditandai sebagai selesai.");
      getEditRequests(); // Refresh daftar request setelah update
  } catch (error) {
      console.log("Gagal menyelesaikan request edit:", error);
  }
};



  return (
    <div className='container mt-5 is-centered'>
      <div className="box">
                <h2 className="subtitle">Request Edit</h2>
                {editRequests.length === 0 ? (
                    <p>Tidak ada request edit yang pending.</p>
                ) : (
                    <table className="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                {/* <th>No</th> */}
                                <th>Production ID</th>
                                <th>Alasan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editRequests.map((request, index) => (
                                <tr key={request.id}>
                                    {/* <td>{index + 1}</td> */}
                                    <td>{request.productionId}</td>
                                    <td>{request.reason}</td>
                                    <td>
                                        <button
                                            className="button is-success is-small"
                                            onClick={() => resolveEditRequest(request.id)}
                                        >
                                            Tandai Selesai
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
      <div className='columns is-half'>
          <table className='table is-striped is-fullwidth'>
            <thead>
            <tr>
                <th colSpan="14" className="has-text-right">
                  <button  onClick={exportProductionResults} className="button is-primary">Export to Excel</button>
                </th>
              </tr>
              <tr>
                <th>Production ID</th>
                <th>Category</th>
                <th>Machine</th>
                <th>Product</th>
                <th>Product Name</th>
                <th>Label</th>
                <th>Detail Label</th>
                <th>Date</th>
                <th>Shift</th>
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
                <td>{production.id}</td>
                <td>{production.kategori}</td>
                <td>{production.mesin}</td>
                <td>{production.jenisproduk}</td>
                <td>{production.namaproduk}</td>
                <td>{production.labelumum}</td>
                <td><Link to={`/admin/production/details/${production.id}`} type='button' className='button is-small is-info'>Details</Link></td>
                <td>{formatDate(production.tanggal)}</td>
                <td>{production.shift}</td>
                <td>{production.supervisor}</td>
                <td>{production.operator1}, {production.operator2}, {production.operator3}</td>
                <td>{production.totaljam}</td>
                <td>{production.tonase}</td>
                <td>{[production.keterangan, production.penyebabKarantina, production.keteranganKarantina]
                    .filter(value => value && value.trim() !== "")
                    .join(", ")}
                </td>
                <td>
                  <Link to={`/admin/production/edit/${production.id}`} className='button is-small is-info mb-1'>Edit</Link>
                  <button onClick={() => deleteProduction(production.id)} className='button is-small is-danger'>Delete</button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  )
}

export default AdminProductionDashboard
