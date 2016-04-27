const scrapeProfile = require('./profile');

scrapeProfile('SOME_USER_HERE').then((profile) => {
  console.log(profile);
});