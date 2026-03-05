import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/register", label: "Register" },
    { path: "/recognize", label: "Recognize" },
    { path: "/attendance", label: "Dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
       <h1 onClick={()=>navigate("/")} className="text-xl font-bold tracking-wide cursor-pointer">
        <span className="text-blue-400 drop-shadow-md">Face</span>
        <span className="text-white">Vision</span>
       </h1>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium ${
                location.pathname === item.path
                  ? "text-blue-400"
                  : "text-gray-300 hover:text-white transition"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
