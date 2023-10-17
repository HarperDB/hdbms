export default DeleteConfirmationDialog({ filepath }) {

  return (
    <div className="confirmation-dialog">
      <p>Delete { filepath } ?</p>
      <button>okay</button>
      <button>cancel</button>
    </div>
  );

}
