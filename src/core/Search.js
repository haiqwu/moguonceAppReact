import React, { useState, useEffect, createRef } from 'react';
import { getCategories, list } from './apiCore';
import Card from './Card';
import './Search.css';

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false,
    });
    const { categories, category, search, results, searched } = data;

    // componentDidMount
    useEffect(() => {
        loadCategories();
        
    }, []);

    const loadCategories = () => {
        getCategories().then( data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setData({
                    ...data,
                    categories: data
                });
            }
        })
    };

    const handleChange = (name) => event => {
        setData({
            ...data,
            [name]: event.target.value, 
            // searched: false // new change.  ( removed )
        });
    };

    const searchData = () => {
        let searchTerm = search;
        if (searchTerm !== undefined) {
            // need trim
            searchTerm = searchTerm.trim();
        }
        
        console.log(searchTerm, category);
        if (searchTerm) { // if search item is not a empty string / undef 
            list({
                search: searchTerm || undefined,
                category,
            }).then( resp => {
                if (resp.error) {
                    console.log(resp.error);
                } else {
                    setData({
                        ...data,
                        results: resp, 
                        searched: true,
                    });
                }
            });
        }
    };

    const searchSubmit = (e) => {
        e.preventDefault();
        searchData();
    };


    const searchForm = () => (
        <form className="form-grp-div" onSubmit={searchSubmit}>

            <span className="input-group-text form-span-grp">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <select
                            className="btn mr-2"
                            style={{width: '149%', border: '1px solid gray'}}
                            onChange={handleChange("category")}
                        >
                            <option value="All">All</option>
                            {categories.map((c, i) => (
                                <option key={i} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="search"
                        className="form-control"
                        onChange={handleChange("search")}
                        placeholder="Search"
                        
                    />
                </div>


                <div
                    className="btn input-group-append svg-outer"
                    style={{ border: "none" }}
                >
                    
                    <svg className="svg-icon" onClick={searchSubmit} viewBox="0 0 20 20">
                        <path fill="none" d="M19.129,18.164l-4.518-4.52c1.152-1.373,1.852-3.143,1.852-5.077c0-4.361-3.535-7.896-7.896-7.896
                            c-4.361,0-7.896,3.535-7.896,7.896s3.535,7.896,7.896,7.896c1.934,0,3.705-0.698,5.078-1.853l4.52,4.519
                            c0.266,0.268,0.699,0.268,0.965,0C19.396,18.863,19.396,18.431,19.129,18.164z M8.567,15.028c-3.568,0-6.461-2.893-6.461-6.461
                            s2.893-6.461,6.461-6.461c3.568,0,6.46,2.893,6.46,6.461S12.135,15.028,8.567,15.028z"></path>
                    </svg>
                    
                    
                </div>
            </span>
     
        </form>
    );

    const searchMessage = (searched, results) => {
        if (searched && results.length > 0) {
            return `Found ${results.length} items`;
        }
        if (searched && results.length === 0) {
            return `We were unable to find matches`;
        }
    };


        
    

    return (
        <div className="row"> 
            <div className="container mb-5">
                { searchForm() }
            </div>
            <div className="container-fluid mb-3">
       
                <h2 className="mt-4 mb-4">
                    { searchMessage(searched, results) }
                </h2>
                <div className="row">
                    { results && results.map((product, i) => (
                        <Card key={i} product={product} />
                    ))}
                </div>
                { searched && <hr /> }
            </div>
        </div>
    );
};

export default Search;
