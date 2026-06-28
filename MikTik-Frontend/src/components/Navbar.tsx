import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, X, Bell, LogOut, User, ShieldCheck,
  Settings, ChevronDown, Globe, Sun, Moon,
  ShoppingBag, Ticket, LayoutList,
} from "lucide-react";
import logo from "../assets/miktik.jpg";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import NotificationPanel from "./NotificationPanel";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const { theme, toggle } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const sellLink =
    user && user.permissionLevel < 2
      ? { to: "/become-seller", label: t("nav.becomeSeller") }
      : { to: "/sell", label: t("nav.sell") };

  const closeAll = () => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setSettingsOpen(false);
    setNotifOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAll();
    navigate("/");
  };

  const navLinkClass = (active: boolean) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
    }`;

  const dropdownLinkClass = (active: boolean) =>
    `flex items-center gap-2.5 px-3 py-2 text-sm w-full transition-colors ${
      active
        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
    }`;

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200/60 dark:border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={closeAll}>
            <img src={logo} alt="MikTik home" className="h-8 w-auto rounded-xl" />
            <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white" aria-hidden="true">
              Mik<span className="text-indigo-600 dark:text-indigo-400">Tik</span>
            </span>
          </Link>

          {/* Desktop center nav */}
          <div className="hidden md:flex items-center gap-1">
            {user?.permissionLevel === 3 && (
              <Link
                to="/admin"
                aria-current={isActive("/admin") ? "page" : undefined}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/admin")
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                {t("nav.adminPanel")}
              </Link>
            )}
            {!user && (
              <Link to="/marketplace" aria-current={isActive("/marketplace") ? "page" : undefined} className={navLinkClass(isActive("/marketplace"))}>
                {t("nav.marketplace")}
              </Link>
            )}
            <Link to={sellLink.to} aria-current={isActive(sellLink.to) ? "page" : undefined} className={navLinkClass(isActive(sellLink.to))}>
              {sellLink.label}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1">

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setUserMenuOpen(false);
                  setSettingsOpen(false);
                }}
                className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
                aria-expanded={notifOpen}
                aria-haspopup="dialog"
              >
                <Bell className="w-4.5 h-4.5" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 bg-indigo-600 dark:bg-indigo-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center leading-none px-0.5" aria-hidden="true">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
            </div>

            {/* Settings dropdown */}
            <div className="relative hidden md:block" ref={settingsRef}>
              <button
                onClick={() => {
                  setSettingsOpen((o) => !o);
                  setUserMenuOpen(false);
                  setNotifOpen(false);
                }}
                className={`p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors ${
                  settingsOpen ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white" : ""
                }`}
                aria-label="Preferences"
                aria-expanded={settingsOpen}
                aria-haspopup="menu"
              >
                <Settings className="w-4.5 h-4.5" aria-hidden="true" />
              </button>

              {settingsOpen && (
                <div role="menu" aria-label="Preferences" className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/10 shadow-lg shadow-black/5 py-1.5 z-50">
                  <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide" aria-hidden="true">
                    {t("nav.preferences")}
                  </p>
                  <button
                    role="menuitem"
                    onClick={toggle}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4 shrink-0" aria-hidden="true" /> : <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />}
                    {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
                  </button>
                  <button
                    role="menuitem"
                    onClick={toggleLang}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {t("nav.language")}
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400" aria-label={lang === "en" ? "Switch to Hebrew" : "Switch to English"}>
                      {lang === "en" ? "עב" : "EN"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth section */}
            {user ? (
              <div className="hidden md:flex items-center">
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setUserMenuOpen((o) => !o);
                      setSettingsOpen(false);
                      setNotifOpen(false);
                    }}
                    aria-label={`Account menu for ${user.name}`}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      userMenuOpen
                        ? "bg-slate-100 dark:bg-white/10"
                        : "hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shrink-0" aria-hidden="true">
                      <User className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-28 truncate" aria-hidden="true">
                      {user.name}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {userMenuOpen && (
                    <div role="menu" aria-label={`Account menu for ${user.name}`} className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/10 shadow-lg shadow-black/5 py-1.5 z-50">
                      <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide truncate" aria-hidden="true">
                        {user.name}
                      </p>
                      <div className="border-t border-slate-100 dark:border-white/5 my-1" role="separator" />
                      <Link role="menuitem" to="/marketplace" onClick={closeAll} className={dropdownLinkClass(isActive("/marketplace"))}>
                        <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
                        {t("nav.marketplace")}
                      </Link>
                      {user.permissionLevel !== 3 && (
                        <Link role="menuitem" to="/buyer-dashboard" onClick={closeAll} className={dropdownLinkClass(isActive("/buyer-dashboard"))}>
                          <Ticket className="w-4 h-4 shrink-0" aria-hidden="true" />
                          {t("nav.myTickets")}
                        </Link>
                      )}
                      {user.permissionLevel >= 2 && (
                        <Link role="menuitem" to="/seller-dashboard" onClick={closeAll} className={dropdownLinkClass(isActive("/seller-dashboard"))}>
                          <LayoutList className="w-4 h-4 shrink-0" aria-hidden="true" />
                          {t("nav.myListings")}
                        </Link>
                      )}
                      <div className="border-t border-slate-100 dark:border-white/5 my-1" role="separator" />
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
                        {t("nav.logOut")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link
                  to="/login"
                  aria-current={isActive("/login") ? "page" : undefined}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  to="/register"
                  aria-current={isActive("/register") ? "page" : undefined}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors shadow-sm shadow-indigo-500/25"
                >
                  {t("nav.getStarted")}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-950 px-4 py-3 space-y-1">
          {user?.permissionLevel === 3 && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              aria-current={isActive("/admin") ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive("/admin")
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              {t("nav.adminPanel")}
            </Link>
          )}
          <Link
            to="/marketplace"
            onClick={() => setMobileOpen(false)}
            aria-current={isActive("/marketplace") ? "page" : undefined}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive("/marketplace")
                ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            {t("nav.marketplace")}
          </Link>
          <Link
            to={sellLink.to}
            onClick={() => setMobileOpen(false)}
            aria-current={isActive(sellLink.to) ? "page" : undefined}
            className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(sellLink.to)
                ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            {sellLink.label}
          </Link>
          {user && user.permissionLevel !== 3 && (
            <Link
              to="/buyer-dashboard"
              onClick={() => setMobileOpen(false)}
              aria-current={isActive("/buyer-dashboard") ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive("/buyer-dashboard")
                  ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              <Ticket className="w-4 h-4" aria-hidden="true" />
              {t("nav.myTickets")}
            </Link>
          )}
          {user && user.permissionLevel >= 2 && (
            <Link
              to="/seller-dashboard"
              onClick={() => setMobileOpen(false)}
              aria-current={isActive("/seller-dashboard") ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive("/seller-dashboard")
                  ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              <LayoutList className="w-4 h-4" aria-hidden="true" />
              {t("nav.myListings")}
            </Link>
          )}

          {/* Preferences */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5">
            <p className="px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide" aria-hidden="true">
              {t("nav.preferences")}
            </p>
            <button
              onClick={toggle}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
              {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
            </button>
            <button
              onClick={toggleLang}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" aria-hidden="true" />
                {t("nav.language")}
              </div>
              <span className="text-xs font-bold text-slate-400" aria-label={lang === "en" ? "Switch to Hebrew" : "Switch to English"}>
                {lang === "en" ? "עברית" : "English"}
              </span>
            </button>
          </div>

          {/* Auth */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shrink-0" aria-hidden="true">
                    <User className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 border border-slate-200 dark:border-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  {t("nav.logOut")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 dark:bg-indigo-500 text-white"
                >
                  {t("nav.getStarted")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
