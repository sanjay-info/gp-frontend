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
import { Container, Row, Col } from 'react-bootstrap';

const VideoUrlPage = () => {
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
                rowData.videoReferenceLink ? (
                    <a href={rowData.videoReferenceLink} target="_blank" rel="noopener noreferrer">
                        View Video
                    </a>
                ) : (
                    'No link available'
                )
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
                            <div className="welcome_text">
                                <span>Video URL</span>
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
                        {/* Mobile View */}
                        <div className="mt-4 d-block d-lg-none">
                            {!datalist || (Array.isArray(datalist) && datalist.length === 0) || (typeof datalist === 'object' && !Array.isArray(datalist) && Object.keys(datalist).length === 0) ? (
                                <p>No records to display</p>
                            ) : (
                                (datalist || []).map((item) => {
                                    return (
                                        <Row key={item.id}>
                                            <Col xs={12} md={8} lg={12}>
                                                <div
                                                    className="p-3"
                                                    style={{
                                                        borderRadius: '10px',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                        backgroundColor: '#fff',
                                                        marginBottom: '5%',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            borderTop: '5px solid #274568',
                                                            borderRadius: '10px 10px 0 0',
                                                        }}
                                                    />
                                                    <div className="p-3">
                                                        <p
                                                            className="text-uppercase mb-2"
                                                            style={{ fontSize: '12px', color: '#999' }}
                                                        >
                                                            {moment(item.date).format("DD-MM-YYYY")}
                                                        </p>
                                                        <p
                                                            className="text-uppercase mb-2"
                                                            style={{ fontSize: '12px', color: '#999' }}
                                                        >
                                                            {item.description}
                                                        </p>
                                                        <div className="holding_mbl">
                                                            <p style={{ margin: "0" }}>
                                                                <a
                                                                    href={item.videoReferenceLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{ color: '#007bff', textDecoration: 'underline' }}
                                                                >
                                                                    {item.videoReferenceLink ? "View Video" : "No link available"}
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    );
                                })
                            )}
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

export default VideoUrlPage;