import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from '../components/AppProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import Alert from '../components/Alert';
import DatePicker from "react-datepicker";
import moment from 'moment';
import MaterialTable from '@material-table/core';
import TableOptions from '../components/TableOptions';

const DroneImgUpload = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const [userid] = useState(localStorage.getItem("user_id"));


    const location = useLocation();
    const id = location.state.id;

    const [imageUpload, setImageUpload] = useState(null);
    const [videoLink, setVideoLink] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAlertTittle] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);

    const [datalist, setDatalist] = useState([]);


    const headers = {
        Authorization: `Bearer ${token}`,
    };


    useEffect(() => {
        getMyDocuments();
    }, [])

    const columns = [
        {
            title: 'S.No',
            field: 'index',
            render: (rowData) => rowData.tableData.index + 1
        },
        {
            title: 'Date',
            field: 'date',
            render: rowData => moment(rowData.date).format('DD-MM-YYYY') // Example format
        },
        {
            title: 'Description',
            field: 'description',
            render: rowData => (
                rowData.description.length > 50 
                    ? rowData.description.substring(0, 50) + '...' 
                    : rowData.description
            )
        },        
        {
            title: 'URL',
            field: 'videoReferenceLink',
            render: rowData => (
                <a href={rowData.videoReferenceLink} target="_blank" rel="noopener noreferrer">
                    {rowData.videoReferenceLink}
                </a>
            )
        }
    ];
    const getMyDocuments = () => {
        const method = 'POST';
        const url = `/client/post/clientId?id=${id}`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "video")
                if (response.data.status === 200) {
                    setDatalist(response.data.data);
                } else {
                    setDatalist([]);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    const handleSave = () => {
        if (!date) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg("Date is required.");
            setAlertClose(() => () => setUserAlert(false));
            return;
        }
        if (!description) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg("Description is required.");
            setAlertClose(() => () => setUserAlert(false));
            return;
        }
        if (!videoLink) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg("Video Link is required.");
            setAlertClose(() => () => setUserAlert(false));
            return;
        }

        const isValidUrl = videoLink.startsWith('https://');

        if (!isValidUrl) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg("Please upload a proper link. Only HTTPS links are allowed.");
            setAlertClose(() => () => setUserAlert(false)); 
            return;
        }
        const url = "/client/post/save";

        // Create a FormData object and append the fields
        const formData = new FormData();
        formData.append("clientDetails.id", id);
        formData.append("date", date);
        formData.append("description", description);
        formData.append("videoReferenceLink", videoLink);

        PostApi('POST', url, formData, headers)
            .then((response) => {
                console.log(response, "response");
                if (response.data.status === 200) {
                    setUserAlert(true);
                    setAlertType("success");
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => {
                        setUserAlert(false);
                        window.location.reload();
                    });
                } else {
                    setUserAlert(true);
                    setAlertType("error");
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => setUserAlert(false));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };


    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div>
                            <div className="welcome_text" style={{ marginLeft: "5px" }}>
                                <span>Upload File</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-4 col-12'>
                                <div className='responsive-column'>
                                    <label className='bond_label'>DATE <span className="required_star">*</span></label>
                                    <DatePicker
                                        showIcon
                                        showYearDropdown
                                        scrollableYearDropdown
                                        selected={date}
                                        // disabled
                                        onChange={(date) => setDate(moment(date).format("YYYY-MM-DD"))}
                                        className='inputbond'
                                        placeholderText='dd-mm-yyyy'
                                        dateFormat="dd-MM-yyyy"
                                        minDate={new Date(process.env.REACT_APP_PAYMENT_DATE)}
                                        maxDate={new Date()}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-4 col-12'>
                                <div className='responsive-column'>
                                    <label className='bond_label'>Description <span className="required_star">*</span> </label>
                                    <input
                                        id="Description"
                                        type="text"
                                        placeholder="Enter Description"
                                        className="inputbond"
                                        value={description}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setDescription(value);
                                        }
                                        }
                                    />
                                </div>
                            </div>
                            <div className='col-lg-4 col-12'>
                                <div className='responsive-column'>
                                    <label className='bond_label'>Video Link <span className="required_star">*</span> </label>
                                    <input
                                        id="conversionrate"
                                        type="text"
                                        placeholder="Enter Video Link"
                                        className="inputbond"
                                        value={videoLink}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setVideoLink(value);
                                        }}
                                    />
                                </div>
                            </div>

                        </div>
                        <div style={{display:'flex',justifyContent:"center",alignItems:"center"}}>

                            <div className='col-lg-4 col-12' >
                                <button className="conversion_btn" onClick={handleSave}>
                                    Submit
                                </button>
                            </div>
                        </div>

                        <div style={{ marginTop: "20px" }} className="d-none d-lg-block">
                            <MaterialTable
                                style={{ width: "100%" }}
                                title=""
                                columns={columns}
                                data={datalist}
                                options={TableOptions()}
                            />
                        </div>
                    </div>
                </div>
                <Alert
                    title={alertTittle}
                    msg={alertMsg}
                    open={userAlert}
                    type={alertType}
                    onClose={alertClose}
                />
            </div>
        </div>
    );
};

export default DroneImgUpload;