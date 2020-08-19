/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Card from './Card';
import { getCategories, getFilteredProducts } from './apiCore';
import { Link } from 'react-router-dom';
import './Shop.css';
import Search from './Search';
import 'rc-slider/assets/index.css'; // slider css
import Slider from 'rc-slider'; // slider

const Shop = () => {
    const createSliderWithTooltip = Slider.createSliderWithTooltip; // Slider
    const Range = createSliderWithTooltip(Slider.Range); // Slider
    const DEFAULT_MIN_PRICE = 0;
    const DEFAULT_MAX_PRICE = 1000;
    const PRICE_MAX_VALUE_ALLOWED = 100000000; //  100,000,000 
    const [priceRange, setPriceRange] = useState([DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]);


    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);

    const [filteredResults, setFilteredResults] = useState([]);

    const [myFilters, setMyFilters] = useState({
        filters: { 
            category: [], // default empty array means : all categoires 
            price: [], // default empty array means: all prices
        },
    });

    

    const handleSliderChange = (valueArray) => {
        setPriceRange(valueArray);
        
        const deepCopyValueArray = [...valueArray];
        if (deepCopyValueArray[1] !== undefined) {
            // if [x, DEFAULT_MAX_PRICE] is selected, then the max will transfer to Infinity(almost)
            if (deepCopyValueArray[1] === DEFAULT_MAX_PRICE) {
                deepCopyValueArray[1] = PRICE_MAX_VALUE_ALLOWED;
            }
        }
        handleFilters(deepCopyValueArray, 'price');
    };


    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setCategories(data);
            }
        })
    };

    // componentDidMount
    useEffect(() => {
        init();
        loadFilteredResults(skip, limit, myFilters.filters);
    }, []);


    const handleCollectionSelect = (e) => {
        const tarName = e.target.name;
        if (tarName === 'All') {
            handleFilters([], 'category');
        } else {
            // tarName is category id
            handleFilters([tarName], 'category');
        }
    };

    const loadFilteredResults = (newFilters) => {
        // console.log(newFilters);
        // Newly added: fixed the skip value to 0.
        // The method loadFilteredResults only being called on a control change (e.g. select collection or price range change)
        // thus, we will use skip of 0 always, as to init the data
        getFilteredProducts(0, limit, newFilters)
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setFilteredResults(data.data);
                    setSize(data.size);
                    setSkip(0);
                }
            });
    };

    const loadMore = () => {
        let toSkip = skip + limit;
        // console.log(newFilters);
        getFilteredProducts(toSkip, limit, myFilters.filters)
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    // data.data is the new data,
                    // filteredResults are the old data we already displayed in view
                    setFilteredResults([...filteredResults, ...data.data]);
                    setSize(data.size);
                    setSkip(toSkip);
                }
            });
    };


  
 

    const handleFilters = (filters, filterBy) => {
        // console.log('SHOP', filters, filterBy);
        const newFilters = {...myFilters};
        newFilters.filters[filterBy] = filters;
        
        loadFilteredResults(newFilters.filters);
        setMyFilters(newFilters);
    };

    return (
        <Layout title="Moguonce" description="Fine loves" className="container-fluid">
            {/* <Search /> */}
            <div className="row">
                <div className="col-3 ml-5">
                    {/* { JSON.stringify(categories) } */}
                    <h4>Shop By Collection</h4>
                    <ul>
                        {
                            <li key={`All-options`} className="li-shop-by-collection">
                                <a 
                                    onClick={handleCollectionSelect} 
                                    name="All" 
                                    style={myFilters.filters.category.length === 0 ? { fontWeight: 'bold' } : {}} 
                                    className="inner-link-shop-by-collection"
                                > All </a>
                            </li>
                        }
                        { categories.map((c, i) => (
                            <li key={i} className="li-shop-by-collection">
                                <a
                                    onClick={handleCollectionSelect} // handleToggle
                                    name={c._id}
                                    style={myFilters.filters.category[0] === c._id ? { fontWeight: 'bold' } : {}} 
                                    className="inner-link-shop-by-collection"
                                >{ c.name }</a>
                            </li>
                        ))}
                        
                    </ul>

                    <h4> Shop By Price </h4>
                    <div className="price-range">
                        <span className="mr-3 price-min-max">$ {priceRange[0]}</span>
                        <Range 
                            min={DEFAULT_MIN_PRICE}
                            max={DEFAULT_MAX_PRICE}
                            step={50}
                            onAfterChange={handleSliderChange}
                            className="slider-range"
                            defaultValue={priceRange}
                            
                            allowCross={false}
                        />
                        <span className="ml-3 price-min-max">$ {priceRange[1] === DEFAULT_MAX_PRICE ? `${DEFAULT_MAX_PRICE}+` : priceRange[1]}</span>
                    </div>
                    
                </div>

                <div className="col-8">
                     
                     <div className="row">
                         {filteredResults.map((product, i) => (
                            <Card key={i} product={product} />
                         ))}
                     </div>
                   
                    { size > 0 && size >= limit && (
                        <div className="load-more-btn-div">
                            <button className="btn btn-outline-primary col-sm-3 mb-5 load-more-btn" onClick={loadMore} >
                                Load more
                            </button>
                        </div>
                    )}
                </div>
               
             
            </div>
        </Layout>
    );
};

export default Shop;