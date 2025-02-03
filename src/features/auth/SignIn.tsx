function SignIn() {
  return (
    <div>
      <h1>Sign In</h1>
      <form>
        <label label="Email" errorText="Invalid email">
        <input 
          id="email"
          name="email"  
          type="email"
          placeholder="Email"
          onChange={() => { console.log('email changed') }}
        />
        </label>
        <label label="Password" errorText="Invalid password">
        <input 
          required
          id="password"
          name="password" 
          type="password" 
          placeholder="Password" 
        />
        </label>
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

export default SignIn
