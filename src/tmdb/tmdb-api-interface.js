/* 
*  This module serves as the primary handler for all TMDb API 
*  calls and has the project API key set as a constant variable
*  based on the API key set in the "key.json" file.
*  Author: Kyle McCain
*  Date: 19 February 2019
*/
const fs = require('fs');
const request = require("request");

// Declare and initialize TMDb API variables
const api_key = JSON.parse(fs.readFileSync(__dirname + '/key.json')).api_key;
const baseURL = 'https://api.themoviedb.org/3/';

// Declare and initialize new error to throw if required parameter is not input
const isRequired = () => { throw new Error('Parameter is required!')}

// Function that calls TMDb API with the input options
let tmbdCall = (options, callback) => {
    // Adds the API key to 'options' prior to calling API
    options.qs.api_key = api_key;

    // Send request and return the 'body' of response or error message if unsuccessful
    request(options, (error, response, body) => {
        // Return error message since no return JSON exists to parse error message
        if (error) {
            callback("Unable to connect to TMDb!")
        // Return error message for status code 401 and 404 from returned JSON
        } else if (response.statusCode === 401 || response.statusCode === 404) {
            callback(body.status_message);
        // Return object of 'body' if no error in transaction
        } else {  
            callback(undefined, JSON.parse(body));
        };
    });
};

// Function that returns the correct string to concatenate with the base 
// URL depending on whether the user is searching for a TV show or a movie
let getSearchURL = (isTV = isRequired()) => {
    if (isTV) {
        return `${baseURL}search/tv`;
    } else {
        return `${baseURL}search/movie`;
    };
};

// Function that returns the correct string to concatenate with the base URL depending 
// on whether the user is doing a detailed search for a TV show or a movie
let getDetailedSearchURL = (isTV = isRequired()) => {
    if (isTV) {
        return `${baseURL}tv/`;
    } else {
        return `${baseURL}movie/`;
    };
};

// Function that returns the correct string to concatenate with the base URL depending 
// on whether the user is posting a rating for a TV show or a movie
let getRatingURL = (id = isRequired(), isTV = isRequired()) => {
    if (isTV) {
        return `${baseURL}tv/${id}/rating`;
    } else {
        return `${baseURL}movie/${id}/rating`;
    };
};

// Function that returns the correct string to concatenate with the base URL 
// in order to send a POST request to add a new guest session
let getAddGuestSessionURL = () => {
    return `${baseURL}authentication/guest_session/new`;
};

// Export functions for use outside of module
module.exports = {
    tmbdCall,
    getSearchURL,
    getDetailedSearchURL,
    getRatingURL,
    getAddGuestSessionURL
};