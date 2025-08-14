import { Link, NavLink } from "react-router-dom";

const navItem =
  "text-sm sm:text-base font-medium text-rose-700/90 hover:text-rose-900 transition";

export default function Header() {
  return (
    <header className="container-p">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-pink-300 via-rose-300 to-amber-200" />
          <span className="text-lg font-semibold text-rose-900">StudyFlow</span>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" className={navItem}>Home</NavLink>
          <NavLink to="/features" className={navItem}>Features</NavLink>
          <NavLink to="/notes" className={navItem}>Notes</NavLink>
          <NavLink to="/contact" className={navItem}>Contact</NavLink>
          <a href="#try" className="btn bg-pink-500 text-white">Try it</a>
        </nav>
      </div>
    </header>
  );
}
