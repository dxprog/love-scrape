const request = require('request');

const config = require('./config');

const PIC_THUMB_REGEX = /src=\"https:\/\/k([\d]+)\.okccdn\.com\/php\/load_okc_image\.php\/images\/225x225\/225x225\/0x0\/0x0\/2\/([\d]+)\.([\w]+)/ig;
const ESSAYS_REGEX = /profilesection-title\"\>([^\<]+)\<\/div\>[\s]+?\<div class=\"essays2015-essay-content\"\>([\s\S]*?)\<\/div\>/ig;
const DETAILS_REGEX = /details2015-section ([\w]+)\"\>[\s\S]*?\<td\>([\s\S]*?)\<\/td\>/ig;
const OTHER_PROFILE_LINKS = /\/profile\/([\w]+)\?cf=profile_similar/ig;
const PERCENT_REGEX = /([\d]+)% Match/ig;
const AGE_REGEX = /basics-asl-age\"\>([\d]+)\</ig;
const LOCATION_REGEX = /basics-asl-location\"\>([^\<]+)\</ig;

module.exports = function scrapeProfile(username) {
  return new Promise((resolve, reject) => {
    request.get({
      url: `http://www.okcupid.com/profile/${username}`,
      headers: {
        Cookie: config.cookie
      }
    }, (err, res, body) => {
      const retVal = {
        username
      };
      const images = body.match(PIC_THUMB_REGEX);
      retVal.images = images.map((image) => image.replace('src="', '').replace('/225x225/225x225', '').replace('/2/', '/0/'));

      let match;
      retVal.essays = {};
      while ((match = ESSAYS_REGEX.exec(body)) !== null) {
        retVal.essays[match[1].trim()] = match[2].trim().replace('<br />', '\n');
      }

      retVal.details = {};
      while ((match = DETAILS_REGEX.exec(body)) !== null) {
        retVal.details[match[1].trim()] = match[2].trim();
      }

      retVal.similar = [];
      while ((match = OTHER_PROFILE_LINKS.exec(body)) !== null) {
        retVal.similar.push(match[1].trim());
      }

      match = PERCENT_REGEX.exec(body);
      retVal.percent = match[1];
      match = AGE_REGEX.exec(body);
      retVal.age = match[1];
      match = LOCATION_REGEX.exec(body);
      retVal.location = match[1];

      resolve(retVal);
    });
  });
};