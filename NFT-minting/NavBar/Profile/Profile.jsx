import React from 'react';
import Image from "next/image";
import {FaUserAlt, FaRegImage, FaUserEdit, FaRegCaretSquareDown} from 'react-icons/fa';
import { MdHelpCenter } from 'react-icons/md'; 
import {TbDownloadOff, TbDownload} from "react-icons/tb";
import Link from 'next/link';

//INTERNAL FOOTER
import Style from "../Profile/Profile.module.css";
import image from "../../img"
import { IMAGES_MANIFEST } from 'next/dist/shared/lib/constants';
s
const HelpCenter = () => {
    FaRegCaretSquareDown(
        <div className={Style.profile}>
            <div className={Stule.profile_accout}>
                <Image src={IMAGES_MANIFEST.user1} alt="user profile" width={50} height={50}/>
                <div className={Style.profile_account_info}>
                    <p>User Name</p>
                    <small>Address</small>
                </div>
            </div>
            <div className={Style.profile_menu}>
                <div className={Style.profile_menu_one}>
                <div className={Style.profile_menu_one_item}>
                        <FaUserAlt/>
                        <p>
                            <Link href={{pathname: '/myprofile'}}>My Profile</Link>
                        </p>
                    </div>
                    <div className={Style.profile_menu_one_item}>
                        <FaRegImage/>
                        <p>
                            <Link href={{pathname: '/my-items'}}>My Items</Link>
                        </p>
                    </div>
                    <div className={Style.profile_menu_one_item}>
                        <FaUserEdit/>
                        <p>
                            <Link href={{pathname: '/edit-profile'}}>Edit Profile</Link>
                        </p>
                    </div>
                </div>

                <div className={Style.profile_menu_two}>
                    <div className={Syle.profile_one_item}>
                        <MdHelpCenter/>
                        <p>
                            <Link href={{pathname: "/help"}}>Help</Link>
                        </p>
                    </div><div className={Syle.profile_one_item}>
                        <TbDownload/>
                        <p>
                            <Link href={{pathname: "/disconnect"}}>Disconnect</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default Profile;