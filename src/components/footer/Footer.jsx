import React from "react";
import "./footer.css";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

function Footer() {
    return (
        <div className="footer">
            <div
                className="love"
                data-aos="fade-right"
                data-aos-duration="3000"
                data-aos-mirror="true">
                Made with 🖤 by Shantanu
            </div>
        </div>
    );
}

export default Footer;
