import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom';

const AdminIntake = () => {
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    const [expire,setExpire] = useState('');
    const [editRequests, setEditRequests] = useState([]);
    const navigate = useNavigate();
  
    const [intake, setIntake] = useState([]);
    useEffect(() => {
        refreshToken();
        getIntake();
        getEditRequests()
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

    const getIntake = async () => {
      const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}intake`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIntake(response.data);
    }


    const refreshToken = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}token`);
            setToken(response.data.accessToken);
            const decodedToken = jwtDecode(response.data.accessToken);
            setRole(decodedToken.role);
            setExpire(decodedToken.exp);
            //if(setRole !== 'intake') navigate('/');
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

  const deleteIntake = async (id) => {
    try {
      await axiosJWT.delete(`${process.env.REACT_APP_API_URL}intake/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      getIntake();
    } catch (error) { 
      console.log(error);
    }
  }

  const exportIntakeResults = async () =>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}export/intake`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "intake_data.xlsx";
    link.click();
} catch (error) {
    console.error("Export failed:", error);
}
};

const getEditRequests = async () => {
  try {
      const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}admin/intake/request-edit`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      setEditRequests(response.data);
  } catch (error) {
      console.log("Gagal mendapatkan request edit:", error);
  }
};

// Fungsi untuk menyelesaikan request edit
const resolveEditRequest = async (id) => {
  try {
      await axiosJWT.patch(`${process.env.REACT_APP_API_URL}admin/intake/request-edit/${id}`, {}, {
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
                                <th>Intake ID</th>
                                <th>Alasan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editRequests.map((request, index) => (
                                <tr key={request.id}>
                                    <td>{request.intakeId}</td>
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
                <th colSpan="10" className="has-text-right">
                  <button onClick={exportIntakeResults} className="button is-primary">Export to Excel</button>
                </th>
              </tr>
              <tr>
                <th>Intake ID</th>
                <th>Material Code</th>
                <th>Material Name</th>
                <th>Date</th>
                <th>Shift</th>
                <th>Operator</th>
                <th>Quantity</th>
                <th>Action</th>
                <th>Create At</th>
                <th>Update At</th>
              </tr>
            </thead>
            <tbody>
              {intake.map((intake, index) => (
                <tr key={intake.id}>
                <td>{intake.id}</td>
                <td>{intake.kodematerial}</td>
                <td>{intake.nama}</td>
                <td>{formatDate(intake.tanggal)}</td>
                <td>{intake.shift}</td>
                <td>{intake.operator}</td>
                <td>{intake.berat}</td>
                <td>
                  <Link to={`/admin/intake/edit/${intake.id}`} className='button is-small is-info mr-2'>Edit</Link>
                  <button onClick={() => deleteIntake(intake.id)} className='button is-small is-danger'>Delete</button>
                </td>
                <td>{formatDateCreate(intake.createdAt)}</td>
                <td>{formatDateCreate(intake.updatedAt)}</td>
              </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
    
  )
}

export default AdminIntake
