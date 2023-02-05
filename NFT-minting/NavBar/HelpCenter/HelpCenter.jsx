import React from 'react';
import Link from "next/link";
//INTERNAL FOOTER
import Style from "./NFT-Minting/NavBar/HelpCenter/HelpCenter.module.css";

const HelpCenter = () => {
    const HelpCenter =[{
        name: "About",
        link: "about"
    },
    {
        name: "Contact Us",
        link: "contact-us"
    },
    {
        name: "Sign Up",
        link: "sign-up"
    },{
        name: "Sign In",
        link: "sign-up"
    },
    {
        name: "Subscription",
        link: "subscription",
    }];
    return <div className={Style.box}>{
        HelpCenter.map((el,i)=>(
            <div className={Style.helpCenter}>
                <Link href={{pathname: '${el.link'}}>{el.name}</Link>
            </div>
        ))
    }</div>;
}
export default HelpCenter;