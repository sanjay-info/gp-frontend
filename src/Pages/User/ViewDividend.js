import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import MaterialTable from '@material-table/core';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment/moment";
import TableOptions from "../components/TableOptions";
import { Modal } from "react-bootstrap";

const ViewDividend = () => {

    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [datalist, setDatalist] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    
    const [userSchemesid, setuserSchemesid] = useState('')
    const [userid] = useState(localStorage.getItem("user_id"));
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [token] = useState(localStorage.getItem("token"));
    const [userType] = useState(localStorage.getItem("UserType"));

    const shareFormatter = new Intl.NumberFormat('en-IN')

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const location = useLocation();
    const state = location.state.item

    useEffect(() => {
        getDividendView()
    }, [])

    const getDividendView = () => {
        const method = 'POST';
        const url = `/dividend/user/getDividend?id=${state.userBondDetails.id}`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response.data, "holding")
                if (response.data.status === 200) {
                    setDatalist(response.data.data);
                }
                else if (response.data.status === 409) {
                    setDatalist([]);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
   
    const columns = [
        // {
        //     title: 'Dividend Date',
        //     // field: 'dividendDate',
        //     render: rowData => moment(rowData.dividendDate).format('DD-MM-YYYY')
        // },
        {
            title: 'Dividend FromDate',
            render: rowData => moment(rowData.fromdate).format('DD-MM-YYYY'),
        },
        {
            title: 'Dividend To Date',
            render: rowData => moment(rowData.toDate).format('DD-MM-YYYY'),
        },
        {
            title: 'Dividend Percentage',
            field: 'dividend.dividendPercentage'
        },
        {
            title: 'Dividend Amount',
            field: 'dividendAmount'
        },
        {
            title: 'Declaration',
            field: 'dividend.declaration'
        },
        
        {
            title: 'TDS Deducted',
            field: 'tdsDeducted'
        },
        {
            title: 'TDS Percentage',
            field: 'tdsPercentage'
        },
        {
            title: 'Days',
            field: 'days',
        },
        {
            title: 'Alloted Amount',
            field: 'amount',
            render: rowData => (
                <text>{shareFormatter.format(rowData.allotedAmount)}</text>
            )
        },
        {
            title: 'Total Amount',
            field: 'totalAmountToPay'
        },
    ];

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container ">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div>
                            <div className="welcome_text">
                                <span>Dividend History</span>
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                {datalist.length > 0 &&
                                    <MaterialTable
                                        style={{ width: "100%" }}
                                        title=""
                                        columns={columns}
                                        data={datalist}
                                        options={TableOptions()}
                                    />
                                }
                                {datalist.length === 0 &&
                                    <text>DIVIDEND NOT YET DECLARED.</text>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ViewDividend