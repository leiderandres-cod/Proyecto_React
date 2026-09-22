import Header from "./Header";
import CartDrawer from "../Cart/CartDrawer";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />
      <main>{children}</main>
      {/* El carrito vive a nivel de Layout para poder abrirse desde cualquier página */}
      <CartDrawer />
    </div>
  );
}

export default Layout;
