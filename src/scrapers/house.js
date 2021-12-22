const cheerio = require('cheerio');
const HtmlEntities = require('html-entities').AllHtmlEntities;
const htmlEntities = new HtmlEntities();

const parseArea = (text) => {
    const decodedText = htmlEntities.decode(text);
    const areaRegex = /(\d*.\d*) m²/.exec(text);
    return areaRegex ? parseFloat(areaRegex[1].replace(',', '.')) : null;
};

const parsePrice = (text) => {
    const decodedText = htmlEntities.decode(text);
    const sanitizedText = decodedText.replace('.', '').replace(',', '.');
    const priceRegex = /(\d+\D?\d*)\s*€/.exec(sanitizedText);
    return priceRegex ? parseFloat(priceRegex[1]) : null;
};

const parseAddress = (text) => {
    const result = {};
    let decodedText = htmlEntities.decode(text);
    const regex = /(\d{5}) (\S+)[^,]*.? ?(.*)?/.exec(decodedText);
    result.postalCode = regex ? regex[1] : null;
    result.city = regex ? regex[2] : null;
    result.address = regex ? (regex[3] || null) : null;
    return result;
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
    house.price = parsePrice($('.hardfacts .hardfact').eq(0).text());
    house.houseArea = parseArea($('.hardfacts .hardfact').eq(1).text().replace(',', '.'));
    house.landArea = parseArea($('.hardfacts .hardfact').eq(3).text().replace(',', '.'));
    house.rooms = parseInt($('.hardfacts .hardfact').eq(2).text(), 10);
    house.availableFrom = null;
    house.images = parseImages($);

    const addressInfo = parseAddress($('.location span').text());
    house = Object.assign(house, addressInfo);

    return house;
};
