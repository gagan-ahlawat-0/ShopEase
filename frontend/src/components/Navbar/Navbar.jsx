import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { Link, NavLink } from 'react-router-dom';
import { Search } from 'lucide-react';
import {Search as SearchFunc}from '../../../utils/Search';

const Navbar = () => {
    const [search, setSearch] = React.useState('');

    const handleSearch = () => {
        console.log("Search");
        if (search !== '') {
            console.log(search);
            SearchFunc(search);
        }
    }

    return (
        <div>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <Link to="/">
                        <img src="/src/assets/logo.png" alt="ShopEase" />
                    </Link>
                </div>
                <div className={styles.searchBar}>
                    <Search onClick={handleSearch} />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        id='search' 
                        name='search' 
                        className={styles.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(search);
                            }
                        }}
                    />
                </div>
                <div>
                    <ul className={styles.links}>
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive ? styles.active : styles.inactive}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) => isActive ? styles.active : styles.inactive}
                            >
                                Profile
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
