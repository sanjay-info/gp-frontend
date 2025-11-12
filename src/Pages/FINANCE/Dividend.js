import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import { Button, Collapse, Card } from 'react-bootstrap';
import { toast } from "react-toastify";
import MaterialTable from '@material-table/core';
import TableOptions from "../components/TableOptions";
import { CiSearch } from "react-icons/ci";

const Dividend = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const [userid] = useState(localStorage.getItem("user_id"));

    const [historyData, setHistoryData] = useState([]);


    const [searchQuery, setSearchQuery] = useState('');
    const [tableKey, setTableKey] = useState(0);

    const [schemeList, setSchemeList] = useState([]);
    const [selectedScheme, setSelectedScheme] = useState();
    const [selectedBond, setSelectedBond] = useState();
    const [selectedBondDescription, setSelectedBondDescription] = useState("");

    const [amount, setAmount] = useState("");
    const [dividedDate, setDividendDate] = useState("");
    const [message, setMessage] = useState("");

    const [showDivided, setShowDivided] = useState(false)

    const [datalist, setDatalist] = useState([]);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        getFilterList();
    }, []);

    useEffect(() => {
        if (schemeList.length > 0) {
            const firstScheme = schemeList[0];
            setSelectedScheme(firstScheme);
            getSchemesList(firstScheme.value);
        }
    }, [schemeList]);

    const getFilterList = () => {
        const method = 'POST';
        const url = "/client/all";
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                const list = response.data.map(item => ({
                    value: item.id,
                    label: item.clientName
                }));
                setSchemeList(list);
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    };

    const handleSchemeSelect = (item) => {
        setSelectedScheme(item);
        setTableKey(prevKey => prevKey + 1);
        getSchemesList(item.value);
    };

    const handleBondSelect = (item) => {
        setSelectedBond(item);
        setSelectedBondDescription(item.label);
    };

    const getSchemesList = (item) => {
        const method = 'POST';
        const url = `/client/finance/id?id=${item}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response.data, "schemas");
                if (response.data) {
                    setDatalist(response.data.data)
                }
                else {
                    setDatalist([])
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    };

    const filteredData = Array.isArray(datalist)
        ? datalist.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        : [];

    const handleView = (item) => {
        navigate('/DividendMaster', { state: { item } });
    }

    const Schemes = [
        {
            title: 'User Type',
            field: 'userType'
        },
        {
            title: 'Scheme Name',
            field: 'bondName'
        },
        {
            title: 'Scheme Description',
            field: 'description'
        },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <button type="button" className="btn btn-primary"
                    onClick={() => {
                        handleView(rowData);
                        console.log(rowData, "page");
                    }} >
                    View
                </button >
            ),
            cellStyle: {
                textAlign: 'center' // Center align the cell content
            },
            headerStyle: {
                textAlign: 'center' // Center align the header content
            }
        }

    ];

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div className="divided_spc">
                            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "5px" }}>
                                <div className="welcome_text">
                                    <span>Dividend</span>
                                </div>
                                <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <CiSearch />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className='input_box'
                                            style={{ height: "100%", width: "100%" }}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Select
                                        options={schemeList}
                                        value={selectedScheme}
                                        onChange={handleSchemeSelect}
                                        placeholder="Select Project"
                                        style={{ height: "100%", width: "100%" }}
                                    />
                                </div>
                            </div>
                            <div>
                                <MaterialTable
                                    key={tableKey}
                                    style={{ width: "100%" }}
                                    title=""
                                    columns={Schemes}
                                    data={filteredData}
                                    options={{ ...TableOptions(), toolbar: false }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dividend;
