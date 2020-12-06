import React from 'react'
import '../App.scss';
import {SidebarData} from "./SidebarData"
import {NavLink} from'react-router-dom'
function Sidebar() {
    return (
        <div className = "Sidebar">
            <ul className="SidebarList">
            {SidebarData.map((val, key)=> {
            return(
               <li key={key} id= {val.id} >               
                    <NavLink to={val.link} className="row"  activeClassName="rowActive">
                        <div className="icon" >{val.icon}</div>
                        <div className="title">{val.title}</div> 
                    </NavLink>  
               
                </li>
                
            );
        })}
        </ul>
        </div>
        
    );
}

export default Sidebar
