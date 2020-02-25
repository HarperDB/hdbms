export default ({ structure, schema, table }) => {
  const schemas = structure && Object.keys(structure).sort();
  const tables = structure && schemas && structure[schema] && Object.keys(structure[schema]).sort();
  const activeTable = structure && schemas && structure[schema] && tables && structure[schema][table] && structure[schema][table];
  return { schemas, tables, activeTable };
};
