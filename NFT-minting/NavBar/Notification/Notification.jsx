import React from 'react';
import Image from "next/image";
//INTERNAL FOOTER
import Style from "../Notification/Notification.module.css";
import images from "../../img";
const HelpCenter = () => {
    return (
        <div className={Style.notification}>
            <p>Notificaiton</p>
            <div className={Style.notificatio_box}>
                <div className={Style.notification_box_img}>
                    <Image src={images.user1} alt="profile image" width={50} height={50}/>
                </div>
                <div className={Style.notification_box_info}>
                    <h4>User Name</h4>
                    <p>Measure action your user...</p>
                    <small>3 minutes ago</small>
                </div>
                <span className={Style.notificatio_box_new}></span>
            </div>
        </div>
    );
}

export default Notification;