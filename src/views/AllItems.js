import React from 'react';
import ItemNode from '../components/ItemNode';
import Spinner from 'react-bootstrap/Spinner';
import { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllItems } from '../services';

const AllItems = () => {

    const [themeContext, setThemeContext] = useContext(ThemeContext);

    const history = useHistory();
    const user = useSelector(state => state);

    const [items, setItems] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchAttribute, setSearchAttribute] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const getData = (pathName) => {
        setIsLoading(true);
        getAllItems(pathName, user.token)
            .then(response => {
                const data  = response.data
                setItems(data)
                setIsLoading(false);
            }).catch(error => {
                if (error.response.status === 401) {
                    window.location.reload();
                }
                let errMsg =  error.response.data.message;
                alert(errMsg);
            })
    }

    useEffect(() => {
        if (typeof user === 'undefined' || user.role === "ADMIN") {
            history.replace("/");
        } else {
            getData('/api/inventory/items');
        }
    }, []);

    const searchForItems = (e) => {
        e.preventDefault();
        let res = searchInput.replace(/ /g, "_");
        if (searchAttribute === "" && res === "") {
            getData('/api/inventory/items');
        } else if (searchAttribute === "") {
            getData(`/api/inventory/items?search=${res}`);
        } else if (searchInput === "") {
            getData(`/api/inventory/items?attribute=${searchAttribute}`);
        } else {
            getData(`/api/inventory/items?attribute=${searchAttribute}&search=${res}`);
        }
    }

    return (
        <div className="container mb-3 mt-3">

            <h2>
                <i className="fas fa-cubes"></i> Items
            </h2>

            <div className="container mb-3 pb-3 pt-3 mt-3 shadow-lg">

                <div className="container">

                    <form className="row">

                        <input 
                            className="form-control me-2 col-md mt-2" 
                            type="search" placeholder="Search" 
                            aria-label="Search" 
                            onChange={(e) => setSearchInput(e.target.value)}>
                        </input>

                        <select 
                            className="form-select col-md mt-2"
                            id="inputGroupSelect01"
                            onChange={(e) => setSearchAttribute(e.target.value)}>
                            <option defaultValue="name">Search by name</option>
                            <option value="serialNumber">Search by serial number</option>
                            <option value="description">Search by description</option>
                            <option value="price">Search by price</option>
                            <option value="category">Search by category</option>
                            <option value="folder">Search by folder</option>     
                        </select>

                        <button 
                            className={`btn ${themeContext.buttonTheme} col-md mt-2`} 
                            type="submit" 
                            onClick={(e) => searchForItems(e)}>
                            <i className="fas fa-search"></i> Search
                        </button>
                    
                    </form>

                </div>

            <hr></hr>
            
            {
                !isLoading ? 
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
                        {items.map(itm => 
                            <ItemNode key={itm.itemId} item={itm}/>)} 
                    </div>: 
                    <Spinner className="extra-margin-top" animation="border" />
            }
            
            </div>

        </div>
    )
}

export default AllItems;
