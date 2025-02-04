function ResetPassword() {
  return (
    <div className="text-white w-sm">
      <h1 className="text-3xl font-light">Reset Password</h1>
      <form>
        <div className="mt-4 mb-2">
          <label className="block pb-2 text-sm" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" placeholder="jane.doe@harperdb.io" />
        </div>
        <button type="submit" className="w-full py-2 mt-6 text-sm rounded-full blue-gradient">
          Send Reset Link
        </button>
      </form>
    </div>
  )
}

export default ResetPassword;
