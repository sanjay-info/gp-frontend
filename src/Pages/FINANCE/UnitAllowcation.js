import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import Select from 'react-select';
import TableOptions from '../components/TableOptions';
import { useNavigate } from "react-router-dom";

const UnitAllowcation = () => {

    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const [userId] = useState(localStorage.getItem("user_id"));

    const [schemeList, setSchemeList] = useState([]);
    const [selectedScheme, setSelectedScheme] = useState()

    const [datalist, setDatalist] = useState([])

    const navigate = useNavigate()

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
                setSchemeList(list)
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const handleSchemeSelect = (item) => {
        setSelectedScheme(item)
        getSchemesList(item.value)
    }

    const getSchemesList = (item) => {
        const method = 'POST';
        const url = "/client/finance/id?id=" + item;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                // const { ri, nri } = response.data;

                // // Modify bondDescription for ri
                // const modifiedRI = ri.map(bond => ({
                //     ...bond,
                //     bondDescription: `Redeemable ${bond.bondDescription}`
                // }));

                // // Modify bondDescription for nri
                // const modifiedNRI = nri.map(bond => ({
                //     ...bond,
                //     bondDescription: `Compulsorily Convertible ${bond.bondDescription}`
                // }));

                // setDatalist([...modifiedRI, ...modifiedNRI])

                setDatalist(response.data.data)
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const handleView = (item) => {
        navigate('/FormList', { state: { item: item } });
    }

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div className="welcome_text" >
                            <span>Unit Allotment</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "10px" }}>
                            <Select
                                options={schemeList}
                                value={selectedScheme}
                                onChange={handleSchemeSelect}
                                placeholder="Select Scheme"
                            />
                        </div>
                        <div>
                            {datalist && datalist.length > 0 ? (
                                datalist.map((item, index) => (
                                    <div className="inves_card" style={{ marginTop: "30px", display: "flex", flexDirection: "column", rowGap: "10px" }} key={index}>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label className="projectlable">
                                                    User Type
                                                </label>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="projectlable">
                                                    Preference Shares
                                                </label>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="projectlable">Share Price Per Unit</label>
                                            </div>
                                            <div className="col-md-2"/>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <span>{item.userType}</span>
                                            </div>
                                            <div className="col-md-4">
                                                <span>{item.bondName}</span>
                                            </div>
                                            <div className="col-md-3">
                                                <span>₹ {item.acquisitionValue}</span>
                                            </div>
                                            <div className="col-md-2">
                                                <button type="button" className="btn btn-primary" onClick={() => handleView(item)}>View</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ width: "100%", paddingTop: "10px", display: "flex", justifyContent: "center" }}>
                                    <span>No records to display</span>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnitAllowcation