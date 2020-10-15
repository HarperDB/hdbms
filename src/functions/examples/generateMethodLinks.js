export default (postmanCollection, folder) => postmanCollection.item.find((item) => item.name === folder).item.map((item) => item.name);
