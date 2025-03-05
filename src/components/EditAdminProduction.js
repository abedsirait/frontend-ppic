import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



const EditAdminProduction = () => {
    const [kategori, setKategori] = useState("");
    const [mesin, setMesin] = useState('');
    const [jenisproduk, setJenisProduk] = useState('');
    const [namaproduk, setNamaProduk] = useState('');
    const [labelumum, setLabelUmum] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [operator1, setOperator1] = useState('');
    const [operator2, setOperator2] = useState('');
    const [operator3, setOperator3] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [tonase, setTonase] = useState('');
    const [totaljam, setTotaljam] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [details, setDetails] = useState([]);

    const [penyebabKarantina, setPenyebabKarantina] = useState("");
    const [keteranganKarantina, setKeteranganKarantina] = useState("");
    const [errorKeterangan, setErrorKeterangan] = useState('');

    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [role, setRole] = useState('');

    const navigate = useNavigate();
    const {id} = useParams();
    const  axiosJWT = axios.create();

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

      useEffect(() => {
        getProductionbyId();
      }, [id]);

      const getProductionbyId = async () => {
        try {
          const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}production/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const rawDate = response.data.tanggal;
          const formattedDate = new Date(rawDate).toISOString().split('T')[0];
          setKategori(response.data.kategori);
          setMesin(response.data.mesin);
          setJenisProduk(response.data.jenisproduk);
          setNamaProduk(response.data.namaproduk);
          setLabelUmum(response.data.labelumum);
          setOperator1(response.data.operator1);
          setOperator2(response.data.operator2);
          setOperator3(response.data.operator3);
          setTanggal(formattedDate);
          setSupervisor(response.data.supervisor);
          setTonase(response.data.tonase);
          setTotaljam(response.data.totaljam);
          setKeterangan(response.data.keterangan);
          setPenyebabKarantina(response.data.penyebabKarantina);
          setKeteranganKarantina(response.data.keteranganKarantina);
          setDetails(response.data.details);
        } catch (error) {
          console.log(error);      
        }
      };

      const UpdateProduction = async (e) => {
        e.preventDefault();
        try {
          await axiosJWT.patch(`${process.env.REACT_APP_API_URL}production/${id}`, {
            kategori,
            mesin,
            jenisproduk,
            namaproduk,
            labelumum,
            operator1,
            operator2,
            operator3,
            tanggal,
            supervisor,
            tonase,
            totaljam,
            keterangan,
            penyebabKarantina,
            keteranganKarantina,
            details
          },{
            headers: {
                Authorization: `Bearer ${token}`
            }
          });
          navigate('/admin/production');
        } catch (error) {
          console.log(error);      
        }
      };

      const productOptions = {
        "Pakan Udang": ["SGH C0", "SGH C1", "SGH C2", "SGH P1.0", "SGH P1.2", "SGH P1.4", "SGH P1.6","SGH P1.8", "FORTUNA P1.2", "FORTUNA P1.4", "FORTUNA P1.6"],
        "Pakan Ikan Apung": [
            "NGA 10-2", "NGA 10-3", "NGA 10-5", "PA ECO 3MM (34%)", "PA ECO 5MM (32%)", 
            "PA ECO 7 MM (28%)", "SPLA 12-3", "M 22 L - 2", "M 22 L - 1 (10Kg)", "M 22 L - 1 (30Kg)",
            "PTN - 2 MM", "PTN - 3 MM", "PTN - 5 MM", "PA-2 Extr", "PA-3 Extr", "PA-4 Extr",
            "PAE 3","PAE 5", "Supra NP 3", "Supra NP 5", "PA TRIAL 3","PA TRIAL 5", "PA TRIAL 7", "SPM 4A 3MM", "SPM 4A 5MM", "LAE 2 MM", "LAE 3 MM", "LAE 5 MM"
        ],
        "Pakan Ikan Tenggelam": ["PI-2 MM (Mas)", "PI-3 MM (Mas)", "PI-4 MM (Mas)", "PI LTE 2", "PI LTE 3"]
    };

    const tonaseMultipliers = {
        "SGH C0":25, "SGH C1":25, "SGH C2":25, "SGH P1.0": 25, "SGH P1.2":25, "SGH P1.4":25, "SGH P1.6":25,"SGH P1.8": 25, "FORTUNA P1.2":20, "FORTUNA P1.4":20, "FORTUNA P1.6":20,
                "NGA 10-2":30, "NGA 10-3":30, "NGA 10-5":30, "PA ECO 3MM (34%)":30, "PA ECO 5MM (32%)":30, 
                "PA ECO 7 MM (28%)":30, "SPLA 12-3":30, "M 22 L - 2":30, "M 22 L - 1 (10Kg)":10, "M 22 L - 1 (30Kg)":30,
                "PTN - 2 MM":30, "PTN - 3 MM":30, "PTN - 5 MM":30, "PA-2 Extr":30, "PA-3 Extr":30, "PA-4 Extr":30,
                "PAE 3":30, "Supra NP 3":30, "Supra NP 5":30, "PA TRIAL 3":20,"PA TRIAL 5":20, "PA TRIAL 7":20, "SPM 4A 3MM":30, "SPM 4A 5MM":30, "LAE 2 MM":30, "LAE 3 MM":30, "LAE 5 MM":30,
        "PI-2 MM (Mas)":50, "PI-3 MM (Mas)":50, "PI-4 MM (Mas)":50, "PI LTE 2":30, "PI LTE 3":30
    };


    const addDetailsLabel = () => {
        setDetails([...details, { detaillabel1: "", detaillabel2: "", detaillabel3: "", operator: "", shift:"",jam: "", tonase_label1: "", tonase_label2: "", tonase_label3: "",karung1:"",  karung2:"", karung3:"" }]);
    };

    const removeLabelGroup = (index) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const handleDetailChange = (index, field, value) => {
        const updatedDetails = [...details];
        // if (field === "berat") {
        //     value = value.replace(",", ".");
        //     value = parseFloat(value.replace(",", ".")) || "";
        // }
        updatedDetails[index][field] = value;
        setDetails(updatedDetails);
    };

    const validateKeterangan = () => {
        const batasRentang = {
          "Kadar Air": [10.6, 10.7],
          "Floating 1": [90, 99],
          "Floating 2": [95, 99],
          "Oversize": [11, 15],
          "Undersize PA 1": [1.1, 2],
          "Undersize PA 2": [0.4, 1],
        };
      
        if (penyebabKarantina in batasRentang) {
          const [min, max] = batasRentang[penyebabKarantina];
          const value = parseFloat(keteranganKarantina);
          
          if (isNaN(value) || value < min || value > max) {
            setErrorKeterangan(`Harus antara ${min} - ${max}`);
            return;
          }
        }
        setErrorKeterangan(""); // Reset error jika valid
      };
  //  const isValid = kategori && mesin && jenisproduk && namaproduk && labelumum && supervisor && operator1 && operator2 && operator3 && tanggal && shift && tonase  && details.every(detail => detail.detaillabel1 && detail.detaillabel2 && detail.detaillabel3 && detail.operator && detail.jam && detail.berat);

  return (
    <div>
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
            <form onSubmit={UpdateProduction}>
                <div className="field">
                    <label className="label">Mesin</label>
                        <div className="select">
                            <select value={mesin} onChange={(e) => setMesin(e.target.value)} required>
                                <option>--Pilih Mesin--</option>
                                <option value="YM 1">YM 1</option>
                                <option value="YM 3">YM 3</option>
                                <option value="YM 2">YM 2</option>
                                <option value="TRIUMPH">TRIUMPH</option>
                                <option value="IDAH">IDAH</option>
                                <option value="PRESS YM">PRESS YM</option>
                                <option value="PRESS YM 2">PRESS YM2</option>
                            </select>
                        </div>
                </div>
                <div className="field">
                    <label className="label">Jenis Produk</label>
                        <div className="select">
                            <select value={jenisproduk} onChange={(e) => setJenisProduk(e.target.value)} required>
                                <option>--Pilih Produk--</option>
                                <option value="Pakan Udang">Pakan Udang</option>
                                <option value="Pakan Ikan Apung">Pakan Ikan Apung</option>
                                <option value="Pakan Ikan Tenggelam">Pakan Ikan Tenggelam</option>
                            </select>
                        </div>
                </div>
                <div className="field">
                    <label className="label">Nama Produk</label>
                        <div className="select">
                            <select value={namaproduk} onChange={(e) => setNamaProduk(e.target.value)} required>
                                <option value="">--Pilih Produk--</option>
                                    {productOptions[jenisproduk]?.map((option) => (
                                <option key={option} value={option}>{option}</option>)) || 
                                <option value="">(Pilih jenis produk dulu)</option>}
                            </select>
                        </div>
                </div>
                <div className="field">
                    <label className="label">Kategori</label>
                        <div className="select">
                            <select value={kategori} onChange={(e) => setKategori(e.target.value)} required>
                                <option>--Pilih Kategori--</option>
                                <option value="Baik">Baik</option>
                                <option value="Karantina">Pakan Karantina</option>
                                <option value="Polos">Karung Polos</option>
                            </select>
                        </div>
                </div>
                {kategori === "Karantina" && (
  <div className="field">
    <label className="label">Penyebab Karantina</label>
    <div className="is-flex">
      <div className="select mr-5">
        <select
          value={penyebabKarantina}
          onChange={(e) => {
            setPenyebabKarantina(e.target.value);
            setKeteranganKarantina(""); // Reset input saat penyebab berubah
          }}
          required
        >
          <option>--Pilih Penyebab--</option>
          <option value="Kadar Air">Kadar Air</option>
          <option value="Floating 1">Floating 1</option>
          <option value="Floating 2">Floating 2</option>
          <option value="Oversize">Oversize</option>
          <option value="Undersize PA 1">Undersize PA 1</option>
          <option value="Undersize PA 2">Undersize PA 2</option>
          <option value="Panjang-Panjang">Panjang-Panjang</option>
          <option value="Kerak">Kerak</option>
          <option value="Belang">Belang</option>
          <option value="Fines PU">Fines PU</option>
          <option value="Fines PI">Fines PI</option>
          <option value="Besar Kecil">Besar Kecil</option>
          <option value="Gosong">Gosong</option>
          <option value="Kontaminasi">Kontaminasi</option>
          <option value="PDI Rendah">PDI Rendah</option>
          <option value="WS Rendah">WS Rendah</option>
          <option value="Warna Tidak Rata">Warna Tidak Rata</option>
          <option value="Lengket-Lengket">Lengket-Lengket</option>
        </select>
      </div>
      <div className="control">
        <input
          type="text"
          className="input"
          value={keteranganKarantina}
          onChange={(e) => setKeteranganKarantina(e.target.value)}
          onBlur={() => {
            validateKeterangan();
          }}
          placeholder="Keterangan"
        />
      </div>
    </div>
    {errorKeterangan && <p className="help is-danger">{errorKeterangan}</p>}
  </div>
)}
                <div className="field">
                    <label className="label">Label Umum</label>
                    <div className="control">
                        <input type="text" className="input" value={labelumum} onChange={(e) => setLabelUmum(e.target.value)} placeholder='Label Umum' required/>
                    </div>
                </div>
                {/* CREATE FORM DETAIL LABEL HERE!!!!!!!! */}

                <div className="field">
                            <label className="label">Detail Label</label>
                            {details.map((detail, index) => (
                                <div key={index} className="box">
                                    <div className="columns">
                                        <div className="column">
                                            <label className="label">Label 1</label>
                                            <input type="text" className="input" value={detail.detaillabel1} onChange={(e) => handleDetailChange(index, "detaillabel1", e.target.value)} required />
                                        </div>
                                        <div className="column">
                                            <label className="label">Label 2</label>
                                            <input type="text" className="input" value={detail.detaillabel2} onChange={(e) => handleDetailChange(index, "detaillabel2", e.target.value)} required />
                                        </div>
                                        <div className="column">
                                            <label className="label">Label 3</label>
                                            <input type="text" className="input" value={detail.detaillabel3} onChange={(e) => handleDetailChange(index, "detaillabel3", e.target.value)} required />
                                        </div>
                                        <div className="column">
                                            <label className="label">Jam</label>
                                            <input type="time" className="input" value={detail.jam} onChange={(e) => handleDetailChange(index, "jam", e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="columns">
                                        <div className="column">
                                            <label className="label">Jmlh Karung label 1</label>
                                            <input type="number" className="input" value={detail.karung1} onChange={(e) => handleDetailChange(index, "karung1", e.target.value)} required />
                                        </div>
                                        <div className="column">
                                            <label className="label">Jmlh Karung label 2</label>
                                            <input type="number" className="input"  value={detail.karung2} onChange={(e) => handleDetailChange(index, "karung2", e.target.value)} required />
                                        </div>
                                        <div className="column">
                                            <label className="label">Jmlh Karung label 3</label>
                                            <input type="number" className="input"  value={detail.karung3} onChange={(e) => handleDetailChange(index, "karung3", e.target.value)} required />
                                        </div>
                                        <div className="column">
                                            <label className="label">Operator</label>
                                            <input type="text" className="input" value={detail.operator} onChange={(e) => handleDetailChange(index, "operator", e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="columns">
                                        <div className="column">
                                            <label className="label">Tonase</label>
                                            <input type="number" className="input" value={detail.tonase_label1= detail.karung1 * tonaseMultipliers[namaproduk] || 0} onChange={(e) => handleDetailChange(index, "tonase_label1", e.target.value)} readOnly required />
                                        </div>
                                        <div className="column">
                                            <label className="label">Tonase</label>
                                            <input type="number" className="input" value={detail.tonase_label2= detail.karung2 * tonaseMultipliers[namaproduk] || 0}onChange={(e) => handleDetailChange(index, "tonase_label2", e.target.value)} readOnly required />
                                        </div>
                                        <div className="column">
                                            <label className="label">Tonase</label>
                                            <input type="number" className="input"  value={detail.tonase_label3= detail.karung3 * tonaseMultipliers[namaproduk] || 0} onChange={(e) => handleDetailChange(index, "tonase_label3", e.target.value)} readOnly required />
                                        </div>
                                        <div className="column">
                                            <label className="label">Shift</label>
                                            <div className="select">
                                            <select value={detail.shift} onChange={(e) => handleDetailChange(index, "shift", e.target.value)} required>
                                                <option>--Pilih Shift--</option>
                                                <option value="1">Shift 1</option>
                                                <option value="2">Shift 2</option>
                                                <option value="3">Shift 3</option>
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" className="button is-danger" onClick={() => removeLabelGroup(index)}>Hapus</button>
                                </div>
                            ))}
                            <button type="button" className="button is-success mt-2" onClick={addDetailsLabel}>Tambah Detail</button>
                        </div> 
                <div className="field">
                    <label className="label">Supervisor</label>
                    <div className="control">
                        <input type="text" className="input" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} placeholder='Supervisor' required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Operator 1</label>
                    <div className="control">
                        <input type="text" className="input" value={operator1} onChange={(e) => setOperator1(e.target.value)} placeholder='Operator 1' required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Operator 2</label>
                    <div className="control">
                        <input type="text" className="input" value={operator2} onChange={(e) => setOperator2(e.target.value)} placeholder='Operator 2' required/>
                    </div>
                </div>
                <div className="field">
                <div className="field">
                    <label className="label">Operator 3</label>
                    <div className="control">
                        <input type="text" className="input" value={operator3} onChange={(e) => setOperator3(e.target.value)} placeholder='Operator 3' required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Tanggal</label>
                    <div className="control">
                        <input type="date" className="input" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Tonase</label>
                    <div className="control">
                        <input type="number" className="input" value={tonase} onChange={(e) => setTonase(e.target.value)} placeholder='Tonase' required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Total Jam</label>
                    <div className="control">
                        <input type="number" className="input" value={totaljam} onChange={(e) => setTotaljam(e.target.value)} placeholder='Total Jam' required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Keterangan</label>
                    <div className="control">
                        <input type="text" className="input" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder='Keterangan' />
                    </div>
                </div>

                <button type='button' onClick={() => navigate("/admin/production/")} className='button is-danger mr-5'>Kembali</button>
                    <button type='submit' className='button is-success'>Update</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default EditAdminProduction
