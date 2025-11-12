import React, { useState, useEffect } from 'react';
import './BackToTop.css';
import { IoIosArrowUp } from "react-icons/io";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div >
            {isVisible &&
                <div className="back-to-top">
                    <IoIosArrowUp onClick={scrollToTop} size={30} className='topIcon' color='#ffffff' />
                </div>
            }
        </div>
    );
};

export default BackToTop;