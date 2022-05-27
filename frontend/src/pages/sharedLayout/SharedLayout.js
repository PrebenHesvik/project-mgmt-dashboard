import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./SharedLayout.scss";

// Outlet is the shared layout that is nested inside the shared route

const SharedLayout = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};
export default SharedLayout;

// const SharedLayout = () => {
//   return (
//     <div className="container">
//       <Navbar />
//       <Outlet />
//     </div>
//   );
// };
// export default SharedLayout;
