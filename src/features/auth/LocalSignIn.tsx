function LocalSignIn() {
  return (
    <main className='flex items-center justify-center h-screen px-6 blue-pink-gradient dark:bg-black-dark'>
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
      <button className='fixed p-2 text-white bg-blue-400 rounded-md bottom-4 right-4'
					  onClick={() => {
							document.documentElement.classList.toggle(
								"dark"
							);
							localStorage.setItem(
								"theme",
								document.documentElement.classList.contains(
									"dark"
								)
									? "dark"
									: "light"
							);
						}}
				>Toggle Theme</button>
    </div>
    </main>
  )
}

export default LocalSignIn;
