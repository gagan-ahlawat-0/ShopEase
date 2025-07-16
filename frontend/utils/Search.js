import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

export const Search = (searchInput) => {
    try {
        const response = axios.get("/api/search/products/" + searchInput);
        console.log(response);
    } catch (error) {
        console.log(error);
        toast.error('An unknown error occurred');
    }
}