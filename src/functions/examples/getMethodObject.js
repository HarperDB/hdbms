export default (postmanCollection, folder, method) => postmanCollection.item.find((item) => item.name === folder).item.find((item) => item.name === method);
