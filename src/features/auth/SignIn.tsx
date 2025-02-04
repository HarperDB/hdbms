function SignIn() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-light">Sign in to HarperDB Studio</h1>
      <form>
        <div className="py-4">
        <label className="block pb-2 text-sm" htmlFor="email">
        Email
        </label>
        <input 
          id="email"
          name="email"  
          type="email"
          placeholder="email address"
          onChange={() => { console.log('email changed') }}
        />
        </div>
        <div>
        <label className="block pb-2 text-sm" htmlFor="password">
        Password
        </label>
        <input 
          required
          id="password"
          name="password" 
          type="password" 
          placeholder="password" 
        />
        </div>
        <button type="submit" className="w-full py-2 mt-6 text-sm rounded-full blue-gradient">Sign In</button>
      </form>
    </div>
  )
}

export default SignIn
