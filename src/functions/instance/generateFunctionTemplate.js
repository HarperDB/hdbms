const routes = `'use strict';

// add your own dependencies via your project's package.json
const needle = require('needle');

// add and import helper methods from your project's "helpers" directory
const filter = require('../helpers/filter');

module.exports = async (server, { hdbCore, logger }) => {
  // THIS IS A SIMPLE POST ROUTE WITH AN OPERATION IN THE REQUEST BODY
  // IT USES THE hdbCore.preValidation HOOK TO PROCESS BASIC OR TOKEN AUTH
  // IT USES THE hdbCore.request METHOD TO EXECUTE THE VALIDATED REQUEST
  server.route({
    url: '/path/to/my/route',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: hdbCore.request,
  })
  
  // THIS GET ROUTE USES A CUSTOM preValidation METHOD TO AUTHORIZE THE REQUEST
  // IT THEN USES THE hdbCore.requestWithoutAuthentication METHOD TO EXECUTE THE REQUEST
  // FINALLY, IT USES A CUSTOM FUNCTION, "filter", TO FORMAT THE RESPONSE
  server.route({
    url: '/path/to/my/route/:id',
    method: 'GET',
    preValidation: async (request, reply) => {
      /*
      *  takes the inbound authorization headers and sends them via http request to an external auth service
      */
      const result = await needle('get', 'https://jsonplaceholder.typicode.com/todos/1', { headers: { authorization: request.headers.authorization }});

      /*
      *  throw an authentication error based on the response body or statusCode
      */
      // eslint-disable-next-line no-magic-numbers
      if (result.body.error || result.statusCode !== 200) {
        const errorString = result.body.error || 'Sorry, there was an error authenticating your request';
        logger.error(errorString);
        throw new Error(errorString);
      }
    },
    handler: async (request) => {
      request.body= {
        operation: 'sql',
        sql: \`SELECT * FROM dev.dogs WHERE id = \${request.params.id}\`
      };

      /*
       * requestWithoutAuthentication bypasses the standard HarperDB authentication.
       * YOU MUST ADD YOUR OWN preValidation method above, or this method will be available to anyone.
       */
      const result = await hdbCore.requestWithoutAuthentication(request);

      return filter(result, ['dog_name', 'owner_name', 'breed']);
    }
  });
};
`;

const helpers = `'use strict'

module.exports = (result) => {
 // your functionality here
 return result;
}
`;

const templates = { routes, helpers };

export default (itemType) => templates[itemType] || null;
