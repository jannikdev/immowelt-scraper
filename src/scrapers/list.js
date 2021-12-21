const cheerio = require('cheerio');

const scrapeHouse = ($houseNode) => {
    const house = {};

    house.url = $houseNode.find('.EstateItem-1c115 > a').attr('href');

    return house;
};

const scrapePagination = $ => ({
    page: parseInt($('#pnlPaging .ci_color').text(), 10),
    totalPages: parseInt($('#pnlPaging .btn_01').last().text(), 10),
});

exports.scrape = (page) => {
    const $ = cheerio.load(page, {
        decodeEntities: false,
        normalizeWhitespace: true,
    });

    const houses = $('.EstateItem-1c115').map((i, apt) => scrapeHouse($(apt))).get();
    const pagination = scrapePagination($);

    return {
        items: houses,
        pagination,
    };
};
