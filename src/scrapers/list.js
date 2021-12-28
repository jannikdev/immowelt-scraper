const cheerio = require('cheerio');

const scrapeHouse = ($houseNode) => {
    const house = {};

    house.url = $houseNode.find('.EstateItem-1c115 > a').attr('href');
    return house;
};

const scrapePagination = pagebody => ({
    page: parseInt(pagebody.substr(pagebody.indexOf('selectedPage')+12,10).substr(0,pagebody.substr(pagebody.indexOf('pagesCount')).indexOf(',')), 10),
    totalPages: parseInt(pagebody.substr(pagebody.indexOf('pagesCount')+12,10).substr(0,pagebody.substr(pagebody.indexOf('pagesCount')).indexOf(',')), 10),
});

exports.scrape = (page) => {
    const $ = cheerio.load(page, {
        decodeEntities: false,
        normalizeWhitespace: true,
    });

    const houses = $('.EstateItem-1c115').map((i, apt) => scrapeHouse($(apt))).get();
    const pagination = scrapePagination(page);

    return {
        items: houses,
        pagination,
    };
};
