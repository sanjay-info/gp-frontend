import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 

const SessionTimer = ({ children }) => {
  
  const sessionTimeoutInMinutes = 1;
  const logoutAfterMilliseconds = sessionTimeoutInMinutes * 60 * 1000;
  const navigate = useNavigate();
  const [roleId] = useState(localStorage.getItem("Role_id"));

  const logoutUser = () => {
    if (roleId === null || roleId === undefined || roleId === "") {
      return;
    }
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    let timer = null;

    const handleUserActivity = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(logoutUser, logoutAfterMilliseconds);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && roleId !== null && roleId !== undefined && roleId !== "") {
        handleUserActivity();
      }
    };

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleUserActivity);

    timer = setTimeout(logoutUser, logoutAfterMilliseconds);

    return () => {
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleUserActivity);
      clearTimeout(timer);
    };
  }, [logoutAfterMilliseconds, navigate]);

  return <>{children}</>;
};

export default SessionTimer;