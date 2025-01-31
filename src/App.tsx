import FabricApp from "./FabricApp";

function App() {

  console.log('version', import.meta.env.VITE_STUDIO_VERSION) 
  console.log('REACT_APP_LOCALSTUDIO', import.meta.env.VITE_REACT_APP_LOCALSTUDIO)

  
  return (
    <>
      <FabricApp />
    </>
  )
}

export default App
