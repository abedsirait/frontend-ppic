import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom';

const IntakeDashboard = () => {
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();
    const [intake, setIntake] = useState([]);

    // State untuk pop-up request edit
    const [showPopup, setShowPopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [reason, setReason] = useState('');

    useEffect(() => {
        refreshToken();
        getIntake();
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

    const getIntake = async () => {
        const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}intake`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const sortedData = response.data.sort((a, b) => b.id - a.id);

        setIntake(sortedData);
    };

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
            hour12: false,
            timeZone: "Asia/Jakarta"
        }).format(new Date(isoDate));
    };

    const deleteIntake = async (id) => {
        try {
            await axiosJWT.delete(`${process.env.REACT_APP_API_URL}intake/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            getIntake();
        } catch (error) {
            console.log(error);
        }
    };

    // Fungsi untuk menentukan apakah data sudah lebih dari 2 hari
    const isOlderThanTwoDays = (createdAt) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffTime = Math.abs(now - createdDate);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays > 2;
    };

    // Fungsi untuk menampilkan pop-up request edit
    const handleRequestEdit = (id) => {
        setSelectedId(id);
        setShowPopup(true);
    };

    // Fungsi untuk mengirim request edit
    const sendEditRequest = async () => {
        if (!reason) {
            alert("Harap masukkan alasan request edit.");
            return;
        }

        try {
            await axiosJWT.post(`${process.env.REACT_APP_API_URL}intake/request-edit`, {
                intakeId: selectedId,
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
                            <th colSpan="10" className="has-text-right">
                                <Link to="/intake/add" className="button is-primary">Add New Data</Link>
                            </th>
                        </tr>
                        <tr>
                            <th>No</th>
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
                                <td>{index + 1}</td>
                                <td>{intake.kodematerial}</td>
                                <td>{intake.nama}</td>
                                <td>{formatDate(intake.tanggal)}</td>
                                <td>{intake.shift}</td>
                                <td>{intake.operator}</td>
                                <td>{intake.berat}</td>
                                <td>
                                    {isOlderThanTwoDays(intake.createdAt) ? (
                                        <button
                                            className='button is-small is-warning mr-2'
                                            onClick={() => handleRequestEdit(intake.id)}
                                        >
                                            Request Edit
                                        </button>
                                    ) : (
                                        <>
                                            <Link to={`/intake/edit/${intake.id}`} className='button is-small is-info mr-2'>
                                                Edit
                                            </Link>
                                            <button onClick={() => deleteIntake(intake.id)} className='button is-small is-danger'>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                                <td>{formatDateCreate(intake.createdAt)}</td>
                                <td>{formatDateCreate(intake.updatedAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pop-up Request Edit */}
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
    );
};

export default IntakeDashboard;
