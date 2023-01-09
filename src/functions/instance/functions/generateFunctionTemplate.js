const routes = `'use strict';

/* Dependencies
- import any packages that are listed in your projects package.json
- for example:
import needle from 'needle'
*/

/* Helpers
- import any helper methods from your project's "helpers" directory
- for example:
import filter from '../helpers/filter.js';
*/

module.exports = async (server, { hdbCore, logger }) => {
  // POST route
  // with hdbCore.preValidation to process basic auth
  // uses hdbCore.requese to execute the validated request
  server.route({
    url: '/path/to/my/route',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: hdbCore.request,
  })

  // GET route
  // with custom validation
  // uses hdbCore.requestWithoutAuthentication
  server.route({
    url: '/path/to/my/route/:id',
    method: 'GET',
    preValidation: async (request, reply) => {
      const token = request.headers.authorization
      const results = hdbCore.requestWithoutAuthentication({
        body: {
          operation: 'search_by_hash',
          schema: 'auth',
          table: 'tokens',
          hash_values: [token],
          get_attributes: ['id']
        }
      })
      if (!results.length) {
        const errorString = result.body.error || 'Sorry, there was an error authenticating your request';
        logger.error(errorString);
        throw new Error(errorString);
      }
    },
    handler: async (request) => {
      const id = parseInt(request.params.id)
      request.body= {
        operation: 'sql',
        sql: \`SELECT * FROM dev.dogs WHERE id = \${id}\`
      };

      /*
       * requestWithoutAuthentication bypasses the standard HarperDB authentication.
       * YOU MUST ADD YOUR OWN preValidation method above, or this method will be available to anyone.
       */
      const result = await hdbCore.requestWithoutAuthentication(request);

      return result
    }
  });
};
`;

const helpers = `
/* filters the results, only returning the selected keys */
export default (result, keys) => {
  return result.map(r => {
    const f = {}
    keys.forEach(k => f[k] = r[k])
    return f;
  })
}
`;

const templates = { routes, helpers };

export default (itemType) => templates[itemType] || null;
