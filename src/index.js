const request = require('request');
const listScraper = require('./scrapers/list');
const houseScraper = require('./scrapers/house');
const statePaths = require('./statePaths.json');

const host = 'https://www.immowelt.de';

const getListUrl = (state, page) => {
    const statePath = statePaths[state];
    if (!statePath) {
        throw new Error(`Invalid state: ${state}`);
    }
    return `${host}/liste/${statePath}/wohnungen/mieten?cp=${page}`;
};

const scrapApartment = url => new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
        if (error) {
            reject(error);
            return;
        }
        if (response.statusCode !== 200) {
            reject(`Invalid response: ${response.statusCode}`);
            return;
        }
        const apartment = houseScraper.scrape(body);
        apartment.url = url;

        resolve(apartment);
    });
});

const scrapeState = (state, page = 1) => new Promise((resolve, reject) => {
    let url;
    try {
        url = getListUrl(state, page);
    } catch (e) {
        reject(e);
        return;
    }

    request(url, (error, response, body) => {
        if (error) {
            reject(error);
            return;
        }
        if (response.statusCode !== 200) {
            reject(`Invalid response: ${response.statusCode}`);
            return;
        }
        const apartments = listScraper.scrap(body);
        const apartmentPromises = apartments.items.map(apt => scrapApartment(host + apt.url));

        resolve(Promise.all(apartmentPromises).then(items => ({
            items,
            pagination: apartments.pagination,
        })));
    });
});

exports.cities = Object.keys(statePaths);
exports.scrapCity = scrapCity;
