import { Outlet } from "react-router";

function DashLayout() {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/app">Dashboard</a>
            </li>
          </ul>
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
      <footer>
        <p>© 2021</p>
        <p>Powered by Harper Systems</p>
      </footer>
    </div>
  )
}

export default DashLayout;
