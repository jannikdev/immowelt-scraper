const cheerio = require('cheerio');
const HtmlEntities = require('html-entities').AllHtmlEntities;
const htmlEntities = new HtmlEntities();

const parseArea = (text) => {
    const decodedText = htmlEntities.decode(text);
    const areaRegex = /(\d*.\d*) m²/.exec(text);
    return areaRegex ? parseFloat(areaRegex[1].replace(',', '.')) : null;
};

// const parsePrice = (text) => {
//     const decodedText = htmlEntities.decode(text);
//     const sanitizedText = decodedText.replace('.', '').replace(',', '.');
//     const priceRegex = /(\d+\D?\d*)\s*€/.exec(sanitizedText);
//     return priceRegex ? parseFloat(priceRegex[1]) : null;
// };

const parseAddress = (text) => {
    const result = {};
    let decodedText = htmlEntities.decode(text);
    const regex = /(\d{5}) (\S+)[^,]*.? ?(.*)?/.exec(decodedText);
    result.postalCode = regex ? regex[1] : null;
    result.city = regex ? regex[2] : null;
    result.address = regex ? (regex[3] || null) : null;
    return result;
};

const parseDescription = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=Title&q;:&q;Objekt)(.*?)(?=&q;,&q;Position&q;)/.exec(decodedText);
    return regex ? regex[1].substr(regex[1].lastIndexOf('&q;')+3) : ''
};

const parseZipcode = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=ZipCode&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseCity = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=City&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseDistrict = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=City&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseStreet = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=street&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parsePrimaryEnergySource = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=PrimaryEnergySource&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseYearOfLastModernization = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=YearOfLastModernization&q;:)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseEstateCategory = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=EstateCategory&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parsePrice = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=object_price&q;:)(.*?)(?=,&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseFederalStateId = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=FederalStateId&q;:)(.*?)(?=,&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseRentTotal = ($) => {
    const price = null;
    const priceRows = $('#divPreise .datatable .datarow');
    for (let i = 0; i < priceRows.length; i++) {
        const row = priceRows.eq(i);
        if (row.find('.datalabel').text().trim() === 'Warmmiete') {
            return parsePrice(row.find('.datacontent').text());
        }
    }
    return price;
};

const parseImages = ($) => {
    //meta property="og:image"
    const metas = $('meta[property="og:image"]');
    return metas.map((i, meta) => meta.attribs.content).get();
};

exports.scrape = (page, url) => {
    const $ = cheerio.load(page, {
        decodeEntities: false,
        normalizeWhitespace: true,
    });

    let house = {};

    house.id = url.substr(url.indexOf('/expose/')+8);
    house.houseArea = parseArea($('.hardfacts .hardfact').eq(1).text().replace(',', '.'));
    house.landArea = parseArea($('.hardfacts .hardfact').eq(3).text().replace(',', '.'));
    house.rooms = parseInt($('.hardfacts .hardfact').eq(2).text(), 10);
    house.images = parseImages($);
    let appstate = $('#serverApp-state').text();
    house.description = parseDescription(appstate);
    house.price = parsePrice(appstate);
    house.federalStateId = parseFederalStateId(appstate);
    house.zipcode = parseZipcode(appstate);
    house.city = parseCity(appstate);
    house.district = parseDistrict(appstate);
    house.street = parseStreet(appstate);
    house.primaryEnergySource = parsePrimaryEnergySource(appstate);
    house.yearOfLastModernization = parseYearOfLastModernization(appstate);
    house.estateCategory = parseEstateCategory(appstate);

    // const addressInfo = parseAddress($('.location span').text());
    // house = Object.assign(house, addressInfo);

    return house;
};
