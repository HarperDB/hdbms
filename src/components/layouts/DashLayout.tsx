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
              <a href="/dashboard">Dashboard</a>
            </li>
          </ul>
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
      <footer>
        <p>© 2021</p>
        <p>Powered by HarperDB</p>
      </footer>
    </div>
  )
}
