const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../../config');

router.get('/', (req, res) => {
  console.log('code', req.query)
  console.log('verifier', req.session)
  request(
    // POST request to /token endpoint
    {
      method: 'POST',
      uri: `https://fusionauth.elastika.pe:${config.fusionAuthPort}/oauth2/token`,
      form: {
        'client_id': config.clientID,
        'client_secret': config.clientSecret,
        'code': req.query.code,
        'code_verifier': req.session.verifier,
        'grant_type': 'authorization_code',
        'redirect_uri': config.redirectURI
      }
    },

    // callback
    (error, response, body) => {
      // save token to session
      console.log('error==>',error)
      console.log('response==>',response)
      console.log('body==>',body)
      req.session.token = JSON.parse(body).access_token;

      // redirect to the React app
      res.redirect(`https://fusionauth.elastika.pe:${config.clientPort}`);
    }
  );
});

module.exports = router;


