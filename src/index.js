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

const scrapeHouse = url => new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
        if (error) {
            reject(error);
            return;
        }
        if (response.statusCode !== 200) {
            reject(`Invalid response: ${response.statusCode}`);
            return;
        }
        const house = houseScraper.scrape(body);
        house.url = url;

        resolve(house);
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
        const houses = listScraper.scrap(body);
        const housePromises = houses.items.map(apt => scrapHouse(host + apt.url));

        resolve(Promise.all(housePromises).then(items => ({
            items,
            pagination: houses.pagination,
        })));
    });
});

exports.states = Object.keys(statePaths);
exports.scrapeState = scrapeState;
