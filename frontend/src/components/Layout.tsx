import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

const NAV_ITEMS = [
  { to: '/suppliers', label: 'ספקים' },
  { to: '/customers', label: 'לקוחות' },
  { to: '/flower-varieties', label: 'זני פרחים' },
]

function Layout() {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <h2 className="app-sidebar-title">תפריט</h2>
        <nav>
          <ul className="app-sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `app-sidebar-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
