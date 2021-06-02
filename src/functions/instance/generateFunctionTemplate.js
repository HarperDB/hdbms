export default (entityName) => `'use strict';

// add your own dependencies and helper methods within your custom functions directory
const filter = require('../helpers/filter');
const authenticator = require('../helpers/authenticator');

module.exports = async (server, { hdbCore, logger }) => {
  // THIS IS A POST ROUTE WITH AN OPERATION IN THE REQUEST BODY
  // IT USES THE hdbCore.preValidation HOOK TO PROCESS BASIC OR TOKEN AUTH
  // IT USES THE hdbCore.request METHOD TO EXECUTE THE VALIDATED REQUEST
  server.route({
    url: '/${entityName}',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: hdbCore.request,
  })
  
  // THIS IS A GET ROUTE
  // IT USES A CUSTOM preValidation HOOK, "authenticator", TO AUTHORIZE THE REQUEST
  // IT USES THE hdbCore.requestWithoutAuthentication METHOD TO EXECUTE THE REQUEST
  // IT USES A CUSTOM FUNCTION, "filter", TO FORMAT THE RESPONSE
  server.route({
    url: '/${entityName}/:id',
    method: 'GET',
    preValidation: authenticator,
    handler: async (request) => {
      // set your request body to any standard HarperDB operation
      request.body= {
        operation: 'sql',
        sql: \`SELECT * FROM dev.dogs WHERE id = \${request.params.id}\`
      };
      // await the result of the requestWithoutAuthentication call
      const result = await hdbCore.requestWithoutAuthentication(request);
      // return the filtered result
      return filter(result, ['dog_name', 'owner_name', 'breed']);
    }
  })
}

module.exports.autoPrefix = ''; // YOU CAN USE THIS PREFIX FOR VERSIONS, OR ROOT PATH
`;
