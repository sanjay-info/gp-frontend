import Header from '../components/Header';
import React, { useState } from 'react';
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from '../components/AppProvider';
import Alert from '../components/Alert';

const AdminMsg = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAlertTittle] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);

    const [msg, setMsg] = useState('')

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const sentMsg = () => {
        if (msg === "") {
            setUserAlert(true);
            setAlertTittle("");
            setAlertMsg("Please Enter the Message");
            setAlertClose(() => () => {
                setUserAlert(false)
            });
            setAlertType("error");
        }
        else {
            const method = 'POST';
            const url = `/ws/message/send?message=` + msg;
            const data = null;
            PostApi(method, url, data, headers)
                .then((response) => {
                    if (response.status === 200) {
                        setMsg('')
                        setUserAlert(true);
                        setAlertTittle("");
                        setAlertMsg("Message Sented");
                        setAlertClose(() => () => {
                            setUserAlert(false)
                        });
                        setAlertType("info");
                    }
                })
                .catch((error) => {
                    console.log("Error sending password:", error);
                });
        }
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
                                <span>Send Message to User's</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                            <div className='input_contanier' style={{ width: "100%" }}>
                                <textarea
                                    type="text"
                                    id="msgValue"
                                    name="remarks"
                                    className='inputtextarea'
                                    rows={5}
                                    placeholder="Enter the Message"
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    maxLength={100}
                                />
                            </div>
                            <button className="login_btn" onClick={() => sentMsg()} type="button" style={{ fontWeight: "bold", width: "10%", height: "fit-content" }}>Send</button>
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

export default AdminMsg;