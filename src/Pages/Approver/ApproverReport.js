import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import DrillDownChart from "../components/Charts/DrillDownChart";

const ApproverReport = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const headers = useMemo(() => ({
        Authorization: `Bearer ${token}`
    }), [token]);

    const [datalist, setDatalist] = useState({});
    const [applicationDataList, setApplicationDataList] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            window.location.reload();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([fetchKycData(), fetchApplicationData()]);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchKycData = async () => {
        try {
            const response = await PostApi('POST', '/report/user/kyc', null, headers);
            setDatalist(response.data);
        } catch (error) {
            console.error("Error fetching KYC data:", error);
            throw error;
        }
    };

    const fetchApplicationData = async () => {
        try {
            const response = await PostApi('POST', '/report/userbond/application', null, headers);
            setApplicationDataList(response.data);
        } catch (error) {
            console.error("Error fetching application data:", error);
            throw error;
        }
    };

    const KycDoughnutData = useMemo(() => ([
        { value: datalist.nriUsers || 0, name: 'NRI KYC', itemStyle: { color: '#E7823A' } },
        { value: datalist.riUsers || 0, name: 'RI KYC', itemStyle: { color: '#546BC1' } }
    ]), [datalist]);

    const KycNriPieData = useMemo(() => ([
        { value: datalist.nriVerified || 0, name: 'NRI KYC Verified', itemStyle: { color: '#E7823A' } },
        { value: datalist.nriNotVerified || 0, name: 'NRI KYC Not Verified', itemStyle: { color: '#546BC1' } }
    ]), [datalist]);

    const KycRiPieData = useMemo(() => ([
        { value: datalist.riVerified || 0, name: 'RI KYC Verified', itemStyle: { color: '#E7823A' } },
        { value: datalist.riNotVerified || 0, name: 'RI KYC Not Verified', itemStyle: { color: '#546BC1' } }
    ]), [datalist]);

    const ApplicationDoughnutData = useMemo(() => ([
        { value: applicationDataList.nriApplication || 0, name: 'NRI Application', itemStyle: { color: '#E7823A' } },
        { value: applicationDataList.riApplication || 0, name: 'RI Application', itemStyle: { color: '#546BC1' } }
    ]), [applicationDataList]);

    const ApplicationNriPieData = useMemo(() => ([
        { value: applicationDataList.nriApplicationVerified || 0, name: 'NRI Application Verified', itemStyle: { color: '#E7823A' } },
        { value: applicationDataList.nriAppNotVerified || 0, name: 'NRI Application Not Verified', itemStyle: { color: '#546BC1' } }
    ]), [applicationDataList]);

    const ApplicationRiPieData = useMemo(() => ([
        { value: applicationDataList.riApplicationVerified || 0, name: 'RI Application Verified', itemStyle: { color: '#E7823A' } },
        { value: applicationDataList.riAppNotVerified || 0, name: 'RI Application Not Verified', itemStyle: { color: '#546BC1' } }
    ]), [applicationDataList]);

    if (loading) {
        return (
            <div>
                <Header />
                <SidePanel />
                <div className="page_container">
                    <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                        <div className="row" style={{ marginTop: "20px" }}>
                            <div className="col-md-12 col-12">
                                <div className="Summary_card">Loading...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <SidePanel />
                <div className="page_container">
                    <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                        <div className="row" style={{ marginTop: "20px" }}>
                            <div className="col-md-12 col-12">
                                <div className="Summary_card">Error: {error.message}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="row" style={{ marginTop: "20px" }}>
                        <div className="col-md-12 col-12">
                            <div className="Summary_card">
                                <div className="row">
                                    <div className="col-lg-6 col-md-12">
                                        <DrillDownChart
                                            doughnutData={KycDoughnutData}
                                            nriPieData={KycNriPieData}
                                            riPieData={KycRiPieData}
                                            title={'KYC Details'}
                                        />
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <DrillDownChart
                                            doughnutData={ApplicationDoughnutData}
                                            nriPieData={ApplicationNriPieData}
                                            riPieData={ApplicationRiPieData}
                                            title={'Application Details'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApproverReport;