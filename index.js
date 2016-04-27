const fs = require('fs');
const path = require('path');

const config = require('./config');
const scrapeProfile = require('./profile');

const scrapeQueue = [];
const scanned = [];

let count = 0;

function scrapeNextProfile() {
  const username = scrapeQueue.shift();
  if (username || count > config.maxProfiles) {
    scrapeProfile(username).then((profile) => {
      console.log(`Profile "${username}" saved.`);
      fs.writeFileSync(path.resolve('profiles', `${username}.json`), JSON.stringify(profile));

      profile.similar.forEach((item) => {
        if (scanned.indexOf(item) === -1) {
          scrapeQueue.push(item);
        }
      });

      scanned.push(username);
      count++;
    }).then(scrapeNextProfile);
  } else {
    console.log(`${count} profiles scraped`);
  }
}

scrapeQueue.push(config.seed);
scrapeNextProfile();