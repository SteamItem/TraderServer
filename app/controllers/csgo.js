const axios = require('axios');
const Param = require('../models/param.js');
const { paramEnum } = require('../helpers/common');

exports.getToken = async (req, res) => {
  let data = JSON.stringify({
    "code":"0000"
  });

  let content = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': '__cfduid=d57b480340f47c7655d6b4397b7a87af81585764759; PHPSESSID=n1avmrlh8kpa6altjkua9tdl4f; do_not_share_this_with_anyone_not_even_staff=5668412_cAQ1q0rTnf7DVCRB0ljeSJ3r3JRptPr5wXb5y4Rb7fkePsBlkgrp1OQDwifO; AWSALB=2E9UgRkedNgfXgHXSgXJqf11DF0zROoKv8kyt45MFgVLD8orAHuX6bTBCrmU1F9l3qGbCDTWpvBntRMBNjtnet4XYzb0BkW2fHlv0qf76IghGX8bngvAOShTBc/+L8snUBf/2IaCj21SDDERmRVJcUvW1qvBdEFuF01Q0hW8vZYCMXWGF4ylthOanWAQgLKTpZOVzhSWbdcK7jasMU5CWxikCxD1HGSp9FosgSvDV1SWTbhw+qvrltcGd1csK30=; AWSALBCORS=2E9UgRkedNgfXgHXSgXJqf11DF0zROoKv8kyt45MFgVLD8orAHuX6bTBCrmU1F9l3qGbCDTWpvBntRMBNjtnet4XYzb0BkW2fHlv0qf76IghGX8bngvAOShTBc/+L8snUBf/2IaCj21SDDERmRVJcUvW1qvBdEFuF01Q0hW8vZYCMXWGF4ylthOanWAQgLKTpZOVzhSWbdcK7jasMU5CWxikCxD1HGSp9FosgSvDV1SWTbhw+qvrltcGd1csK30='
    }
  };
  var result = await axios.post('https://csgoempire.gg/api/v2/user/security/token', data, content);
  res.send(result.data);
}

exports.profile = async () => {
  var cookieParam = await Param.findOne({id: paramEnum.Cookie});

  let content = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieParam.value
    }
  };
  var result = await axios.get('https://csgoempire.gg/api/v2/user', content);
  res.send(result.data);
};
