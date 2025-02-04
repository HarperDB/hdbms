function LocalSignIn() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-light">Please sign into HarperDB</h1>
      <form>
        <div className="py-4">
        <label className="block pb-2 text-sm" htmlFor="instanceuser">
        Instance User
        </label>
        <input 
          id="instanceuser"
          name="instanceuser"  
          type="text"
          placeholder="TestUser"
        />
        </div>
        <div>
        <label className="block pb-2 text-sm" htmlFor="instancepassword">
        Instance Password
        </label>
        <input 
          required
          id="instancepassword"
          name="instancepassword" 
          type="password" 
          placeholder="instance password" 
        />
        </div>
        <button type="submit" className="w-full py-2 mt-6 text-sm rounded-full blue-gradient">Sign In</button>
      </form>
    </div>
  )
}

export default LocalSignIn;
