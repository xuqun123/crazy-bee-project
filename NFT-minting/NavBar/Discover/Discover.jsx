import React from 'react';
import Link from './next/link';
//INTERNAL FOOTER
import Style from "./NFT-Minting/NavBar/Discover/Discover.module.css";

const Discover = () => {
    //Discover Navigation Menu
    const discover = [{
        name: "Collection",
        link: "Collection"
    },
    {
        name: "Author Profile",
        link: "author-profile"
    },
    {
        name: "Account Setting",
        link: "account-setting"
    },
    {
        name: "Connect Wallet",
        link: "collection"
    },
    {
        name: "BLog",
        link: "blog",
    }];
    return (
    <div>
        {discover.map((el,i)=>(
            <div key={i+1} className={Style.discover}>
                <Link href={{pathname: '${el.link}'}}>{el.name}</Link>.
            </div>
        ))}
    </div>);
}
export default Discover;