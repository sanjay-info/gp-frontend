import React, { useState, useEffect } from "react";
import { useAppContext } from "../components/AppProvider";
import Header from "../components/Header";
import { useSidebar } from "../components/SidebarContext";
import SidePanel from "../components/SidePanel";
import MaterialTable from '@material-table/core';
import TableOptions from "../components/TableOptions";
import useWebSocket from "../components/useWebSocket";

const OtpCenter = () => {

    const { GetApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();

    const [token] = useState(localStorage.getItem("token"));
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const [index, setIndex] = useState(0)
    const [tableKey, setTableKey] = useState(0);

    const { registerOtpFlag, forgotOtpFlag } = useWebSocket();

    const [dataList, setDatalist] = useState([]);


    useEffect(() => {
        getRegisterOtpList()
    }, [])

    useEffect(() => {
        if (registerOtpFlag) {
            getRegisterOtpList();
        }
    }, [registerOtpFlag]);

    useEffect(() => {
        if (forgotOtpFlag) {
            getForgotOtpList();
        }
    }, [forgotOtpFlag]);

    const handleTabChange = (tabIndex) => {
        setIndex(tabIndex);
        if (tabIndex === 0) {
            setTableKey(prevKey => prevKey + 1);
            getRegisterOtpList()
        }
        if (tabIndex === 1) {
            setTableKey(prevKey => prevKey + 1);
            getForgotOtpList()
        }
    };

    const getRegisterOtpList = () => {
        const method = 'Get';
        const url = `/ws/registrationDetails`;
        const data = null;
        GetApi(method, url, data, headers)
            .then((response) => {
                console.log(response.data, "Register Otp List");
                setDatalist(response.data)
                setIndex(0)
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const getForgotOtpList = () => {
        const data = {}
        const url = "/ws/profileDetails"
        GetApi('Get', url, data, headers)
            .then((response) => {
                console.log(response, "Forgot Otp List")
                setIndex(1)
                setDatalist(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const columns = [
        {
            title: "S.No",
            field: "serialNo",
            width: "70px"
        },
        {
            title: "Name",
            render: (rowData) => (
                <text>{rowData.name || rowData.firstName}</text>
            ),
        },
        {
            title: "Email Id",
            field: "emailId"
        },
        {
            title: "Mobile No",
            field: "mobileNo",
        },
        {
            title: "Mobile Otp",
            field: "mobileOtp",
        },
    ];

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container ">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div className="dividend-tabs" style={{ display: "flex", gap: "10px" }}>
                                <button className={index === 0 ? "active" : ""} onClick={() => handleTabChange(0)}>
                                    <span>Registration Otp</span>
                                </button>
                                <button className={index === 1 ? "active" : ""} onClick={() => handleTabChange(1)}>
                                    <span>Forgot / Change Password Otp</span>
                                </button>
                            </div>
                        </div>
                        <div style={{ paddingTop: "15px" }}>
                            <MaterialTable
                                key={tableKey}
                                style={{ width: "100%" }}
                                title=""
                                columns={columns}
                                data={dataList.map((row, i) => ({
                                    ...row,
                                    serialNo: i + 1,
                                }))}
                                options={{ ...TableOptions() }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default OtpCenter