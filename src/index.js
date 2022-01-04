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
    let url = `${host}/liste/${statePath}/haeuser/kaufen?sp=${page}`;
    console.log(`retrieving list from ${url}`);

    return url;
};

const scrapeHouse = url => new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
        if (error) {
            reject(error);
            return;
        }
        if (response.statusCode !== 200) {
            reject(`Invalid response for ${url}: ${response.statusCode}`);
            return;
        }
        const house = houseScraper.scrape(body, url);
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
            reject(`Invalid response for ${url}: ${response.statusCode}`);
            return;
        }
        const houses = listScraper.scrape(body);

        resolve(Promise.all(houses.items.map(apt => scrapeHouse(apt.url).catch(e => e))).then(items => ({
            items,
            pagination: houses.pagination,
        })).catch(e => console.log(e)));
    });
});

exports.states = Object.keys(statePaths);
exports.scrapeState = scrapeState;
