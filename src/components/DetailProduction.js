import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const axiosJWT = axios.create(); // Pindahkan ke luar komponen agar tidak dibuat ulang setiap render

const DetailProduction = () => {
    const { id } = useParams(); // Ambil ID dari URL
    const [production, setProduction] = useState(null);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [role, setRole] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getProductionDetail();
    }, [id]);

    axiosJWT.interceptors.request.use(
        async (config) => {
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
        },
        (error) => {
            return Promise.reject(error);
        }
    );

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

    const getProductionDetail = async () => {
        try {
            const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}production/${id}`);
            setProduction(response.data);
        } catch (error) {
            console.error('Failed to fetch production details:', error);
            navigate('/production'); // Redirect jika error
        }
    };

    if (!production) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="title">Detail Label</h1>
            <div className="box">
                <table className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Detail Label 1</th>
                            <th>Jmlh Karung label 1</th>
                            <th>tonase label 1</th>
                            <th>Detail Label 2</th>
                            <th>Jmlh Karung label 1</th>
                            <th>tonase label 2</th>
                            <th>Detail Label 3</th>
                            <th>Jmlh Karung label 1</th>
                            <th>tonase label 3</th>
                            <th>Operator</th>
                            <th>Shift</th>
                            <th>Jam</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(production.details) ? (
                            production.details.map((detail, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{detail.detaillabel1}</td>
                                    <td>{detail.karung1}</td>
                                    <td>{detail.tonase_label1}</td>
                                    <td>{detail.detaillabel2}</td>
                                    <td>{detail.karung2}</td>
                                    <td>{detail.tonase_label2}</td>
                                    <td>{detail.detaillabel3}</td>
                                    <td>{detail.karung3}</td>
                                    <td>{detail.tonase_label3}</td>
                                    <td>{detail.operator}</td>
                                    <td>{detail.shift}</td>
                                    <td>{detail.jam ? detail.jam.slice(0, 5) : '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>1</td>
                                <td>{production.details?.detaillabel1 || '-'}</td>
                                <td>{production.details?.detaillabel2 || '-'}</td>
                                <td>{production.details?.detaillabel3 || '-'}</td>
                                <td>{production.details?.operator || '-'}</td>
                                <td>{production.details? production.details.jam.slice(0, 5) : '-'}</td>
                                <td>{production.details?.berat || '-'}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button type="button" onClick={(e) => { e.preventDefault(); navigate("/production"); }} className='button is-danger mr-5'>Kembali</button>
            </div>
        </div>
    );
};

export default DetailProduction;
