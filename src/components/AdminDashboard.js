import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    const [expire, setExpire] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}token`);
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decodedToken = jwtDecode(response.data.accessToken);
            setRole(decodedToken.role);
            setExpire(decodedToken.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const refreshToken = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}token`);
            setToken(response.data.accessToken);
            const decodedToken = jwtDecode(response.data.accessToken);
            setRole(decodedToken.role);
            setExpire(decodedToken.exp);
        } catch (error) {
            if (error.response) {
                navigate('/');
            }
        }
    };


    const handleNavigate = (path) => {
        navigate(path);
        setIsDropdownOpen(false);
    };

    return (
        <div className="container mt-5">
            <div className="is-flex is-justify-content-space-between mb-4">
                <div className="title">Admin Dashboard</div>
                <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''} is-right`}>
                    <div className="dropdown-trigger">
                        <button
                            className="button is-info"
                            aria-haspopup="true"
                            aria-controls="dropdown-menu"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span>Pilih Data</span>
                            <span className="icon is-small">
                                <i className="fas fa-angle-down"></i>
                            </span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                            <a onClick={() => handleNavigate('/admin/intake')} className="dropdown-item">
                                Intake Data
                            </a>
                            <a onClick={() => handleNavigate('/admin/production')} className="dropdown-item">
                                Production Data
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabel Request Edit */}
            {/* <div className="box">
                <h2 className="subtitle">Request Edit</h2>
                {editRequests.length === 0 ? (
                    <p>Tidak ada request edit yang pending.</p>
                ) : (
                    <table className="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Intake ID</th>
                                <th>Alasan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editRequests.map((request, index) => (
                                <tr key={request.id}>
                                    <td>{index + 1}</td>
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
            </div> */}
        </div>
    );
};

export default AdminDashboard;
