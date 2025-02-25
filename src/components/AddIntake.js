import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const AddIntake = () => {
    const [kodematerial, setCode] = useState("");
    const [nama, setName] = useState("");
    const [tanggal, setDate] = useState("");
    const [shift, setShift] = useState("");
    const [operator, setOperator] = useState("");
    const [berat, setTonase] = useState("");
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [role, setRole] = useState('');

    const navigate = useNavigate();

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

    


    const saveIntake = async (e) => {
        e.preventDefault();
        try {
          await axiosJWT.post(`${process.env.REACT_APP_API_URL}uploadintake`, {
            kodematerial,
            nama,
            tanggal,
            shift,
            operator,
            berat
          });
          navigate("/intake");
        } catch (error) {
          console.log(error);
        }
      };

    const isValid = kodematerial && nama && tanggal && shift && operator && berat;
  return (
    <div>
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
            <form onSubmit={saveIntake}>
                <div className="field">
                    <label className="label">Kode Material</label>
                    <div className="control">
                        <input type="text" className="input" value={kodematerial} onChange={(e) => setCode(e.target.value)} placeholder='Kode Material' required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Nama Material</label>
                    <div className="control">
                        <input type="text" className="input " value={nama} onChange={(e) => setName(e.target.value)} placeholder='Nama Material' required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Tanggal</label>
                    <div className="control">
                        <input type="date" className="input" value={tanggal} onChange={(e) => setDate(e.target.value)} required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Shift</label>
                        <div className="select">
                            <select value={shift} onChange={(e) => setShift(e.target.value)} required>
                                <option>--Pilih Shift--</option>
                                <option value="1">Shift 1</option>
                                <option value="2">Shift 2</option>
                                <option value="3">Shift 3</option>
                            </select>
                        </div>
                </div>
                <div className="field">
                    <label className="label">Operator</label>
                    <div className="control">
                        <input type="text" className="input " value={operator} onChange={(e) => setOperator(e.target.value)} placeholder='Operator' required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Tonase</label>
                    <div className="control">
                        <input type="number" className="input" value={berat} onChange={(e) => setTonase(e.target.value)} placeholder='Tonase' required />
                    </div>
                </div>
                <div className="field">
                    <button type='button' onClick={() => navigate("/intake")}  className='button is-danger mr-5'>Kembali</button>
                    <button type='submit' className='button is-success' disabled={!isValid}>Simpan</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default AddIntake
