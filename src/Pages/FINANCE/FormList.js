import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import Select from 'react-select';
import TableOptions from '../components/TableOptions';
import { useLocation, useNavigate } from "react-router-dom";
import MaterialTable from '@material-table/core';

const FormList = () => {

    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));

    const roleId = localStorage.getItem("Role_id");

    let storedRoleId = JSON.parse(roleId)

    const location = useLocation();
    const storedItem = location.state.item;

    const navigate = useNavigate()

    const [datalist, setDatalist] = useState([])
    const [filterStatus, setFilterStatus] = useState({});
    const [tableKey, setTableKey] = useState(0);

    const headers = {
        Authorization: `Bearer ${token}`
    };

    // useEffect(() => {
    //     getFormList();
    // }, []);

    const filterOptions = [
        ...(storedRoleId[0].id === 6 ? [{ value: 2, label: 'Approval Pending' }] : []),
        { value: 1, label: 'Approved' },
        { value: 3, label: 'Rejected' }
    ];

    const handleFilterChange = (selectedOption) => {
        setFilterStatus(selectedOption);
        setTableKey(prevKey => prevKey + 1);
        getFormList(selectedOption.value)
    };

    useEffect(() => {
        if (filterOptions.length > 0) {
            const firstScheme = filterOptions[0];
            setFilterStatus(firstScheme);
            getFormList(firstScheme.value);
        }
    }, []);

    const getFormList = (status) => {
        const method = 'POST';
        const url = "/dividend/getUserBond?id=" + storedItem.id + "&status=" + status;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response)
                if (response.data.status === 200) {
                    setDatalist(response.data.data)
                }
                else {
                    setDatalist([])
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const handleView = (id) => {
        console.log(id)
        navigate(storedRoleId[0].id === 4 ? '/ApplicationForm' : '/AllotmentForm', { state: { id: id } });
    }

    const columns = [
        {
            title: 'Form Number',
            field: 'formNo'
        },
        {
            title: 'Name',
            field: 'name'
        },
        {
            title: 'Investor Type',
            field: 'investorType.investorType'
        },
        {
            title: 'Interest Status',
            field: 'interestPaid',
            render: (rowData) => (
                <input
                    type="checkbox"
                    checked={rowData.interestPaid}
                    disabled
                />
            ),
            cellStyle: {
                textAlign: 'center'
            },
            headerStyle: {
                textAlign: 'center'
            },
        },
        {
            title: "Action",
            render: rowData => (
                <button className="btn btn-primary" onClick={() => handleView(rowData.id)}>
                    View</button>
            ),
            cellStyle: {
                textAlign: 'center'
            },
            headerStyle: {
                textAlign: 'center'
            },
            sorting: false,
        }
    ];


    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div className="welcome_text" >
                            <span>{storedItem.bondDescription}</span>
                        </div>
                        <div className='col-lg-3' style={{ paddingTop: '20px', display: "flex", justifyContent: "flex-end", width: "100%" }}>
                            <Select
                                options={filterOptions}
                                value={filterStatus}
                                onChange={handleFilterChange}
                                placeholder="Select Status"
                            />
                        </div>
                        <div style={{ marginTop: "20px" }}>
                            <MaterialTable
                                key={tableKey}
                                style={{ width: "100%" }}
                                title=""
                                columns={columns}
                                data={datalist}
                                options={TableOptions()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default FormList