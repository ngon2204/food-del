import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";

const AppDownload = () => {
    return (
        <div className="app-download" id="app-download">
            <p>
                Để có trải nghiệm tốt hơn, hãy tải ứng dụng này.
                <br />
                Sau Hang App
            </p>
            <div className="app-download-platfroms">
                <img src={assets.play_store} alt="" />
                <img src={assets.app_store} alt="" />
            </div>
        </div>
    );
};

export default AppDownload;
