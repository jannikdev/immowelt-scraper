const cheerio = require('cheerio');
const HtmlEntities = require('html-entities').AllHtmlEntities;
const htmlEntities = new HtmlEntities();

const parseArea = (text) => {
    const decodedText = htmlEntities.decode(text);
    const areaRegex = /(\d*.\d*) m²/.exec(decodedText);
    return areaRegex ? parseFloat(areaRegex[1].replace('.','').replace(',', '.')) : null;
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
    const regex = /(?<=District&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseStreetName = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=streetName:")(.*?)(?=")/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseHouseNumber = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=houseNumber:")(.*?)(?=")/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parsePrimaryEnergySource = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=PrimaryEnergySource&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseYearOfLastModernization = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=YearOfLastModernization&q;:)(.*?)(?=,&q;)/.exec(decodedText);
    return regex ? regex[1].replace(/[^\d-]/g, '') : ''
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

const parseFederalState = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=FederalState&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseConstructionYear = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=ConstructionYear&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseUsage = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=USAGE&q;,&q;Value&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseKeywords = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=Stichworte&q;,&q;Content&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseEfficiencyClass = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=Class&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseFloors = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=FLOOR&q;,&q;Value&q;:&q;)(.*?)(?=[^\d])/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseEnergyUsage = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=EnergyType&q;:&q;UNDEFINED&q;,&q;Value&q;:)(.*?)(?=,&q;)/.exec(decodedText);
    return regex ? regex[1].replace(/[^\d.-]/g, '') : ''
};

const parseHotWaterIncluded = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=HotWaterIncluded&q;:)(.*?)(?=})/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseHeating = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=HEATING&q;,&q;Value&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parsePricingInformation = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=Preisinformation&q;,&q;Content&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseFurnishing = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=Ausstattung&q;,&q;Content&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseOther = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=Sonstiges&q;,&q;Content&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseSeparation = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=Raumaufteilung&q;,&q;Content&q;:&q;)(.*?)(?=&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseLocationDescription = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=Title&q;:&q;Lage)(.*?)(?=&q;,&q;Position&q;)/.exec(decodedText);
    return regex ? regex[1].substr(regex[1].lastIndexOf('&q;')+3) : ''
};

const parseHouseArea = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=LivingSpace&q;:)(.*?)(?=,&q;)/.exec(decodedText);
    return regex ? regex[1] : ''
};

const parseLandArea = (appstate) => {
    let decodedText = htmlEntities.decode(appstate);
    const regex = /(?<=LandArea&q;:)(.*?)(?=[^\d.])/.exec(decodedText);
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
    // house.houseArea = parseArea($('.hardfacts .hardfact').eq(1).text().replace(',', '.'));
    // house.landArea = parseArea($('.hardfacts .hardfact').eq(3).text().replace(',', '.'));
    // house.images = parseImages($);
    let appstate = $('#serverApp-state').text();
    house.houseArea = parseHouseArea(appstate);
    house.landArea = parseLandArea(appstate);
    house.rooms = parseInt($('.hardfacts .hardfact').eq(2).text(), 10);
    house.description = parseDescription(appstate);
    house.price = parsePrice(appstate);
    house.federalStateId = parseFederalStateId(appstate);
    house.federalState = parseFederalState(appstate);
    house.zipcode = parseZipcode(appstate);
    house.city = parseCity(appstate);
    house.district = parseDistrict(appstate);
    house.streetName = parseStreetName(appstate);
    house.houseNumber = parseHouseNumber(appstate);
    house.primaryEnergySource = parsePrimaryEnergySource(appstate);
    house.yearOfLastModernization = parseYearOfLastModernization(appstate);
    house.estateCategory = parseEstateCategory(appstate);
    house.constructionYear = parseConstructionYear(appstate);
    house.usage = parseUsage(appstate);
    house.keywords = parseKeywords(appstate);
    house.efficiencyClass = parseEfficiencyClass(appstate);
    house.floors = parseFloors(appstate);
    house.energyUsage = parseEnergyUsage(appstate);
    house.hotWaterIncluded = parseHotWaterIncluded(appstate);
    house.heating = parseHeating(appstate);
    house.pricingInformation = parsePricingInformation(appstate);
    house.furnishing = parseFurnishing(appstate);
    house.other = parseOther(appstate);
    house.separation = parseSeparation(appstate);
    house.locationDescription = parseLocationDescription(appstate);

    // const addressInfo = parseAddress($('.location span').text());
    // house = Object.assign(house, addressInfo);

    return house;
};
