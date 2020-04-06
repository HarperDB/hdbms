export default ({ entities, compute_stack_id, schema, table, history, targetPath }) => {
  console.log(entities, schema, table);

  switch (true) {
    case !entities.schemas.length && history.location.pathname !== targetPath:
      history.push(`/instance/${compute_stack_id}${targetPath}`);
      break;
    case entities.schemas && entities.schemas.length && (!schema || !entities.schemas.includes(schema)):
      history.push(`/instance/${compute_stack_id}${targetPath}/${entities.schemas[0]}`);
      break;
    case entities?.tables?.length && (!table || !entities.tables.includes(table)):
      history.push(`/instance/${compute_stack_id}${targetPath}/${schema}/${entities.tables[0]}`);
      break;
    default:
      break;
  }
};
