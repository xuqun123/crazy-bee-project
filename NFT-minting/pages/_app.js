import "../styles/stylesf3.css"

import {NavBar} from "../component";
const MyApp = ({Component,pageProps})=>(
    <div>
        <NavBar />
        <Component {...pageProps}/>
    </div>
);

export default MyApp;