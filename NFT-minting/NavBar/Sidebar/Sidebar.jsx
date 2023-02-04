import React from 'react';
import Image from "next/image";
import Link from "next/link";
import {GrClose} from 'react-icons/gr';
import {TiSocialFacebook, TiSocialLinkedin, TiSocialTwitter, TiSocialYoutube, TiSocialInstagram, TiArrowSortedDown, TiArrowSortedUp} from "react-icons/ti";

//INTERNAL FOOTER
import Style from "../Sidebar./SideBar.module.css";
import images from "../../img";
import Button from "../../Button/Button";


const HelpCenter = () => {
    //Use State
    const [openDiscover, setOpenDiscover] = useState(false);
    const [spenHelp, setOpenHelp] = useState(false);
    
    return <div>SideBar</div>;
}
export default SideBar;