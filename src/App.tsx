import React, { useEffect } from "react";
import { BrowserRouter, Routes, useLocation } from "react-router-dom";
// Admin routes
import AuthRoutes from "./routes/authRoutes";
import AdminRoutes from "./routes/adminRoutes";
import CommonModal from "./views/common/CommonModal";
import { ModalProvider } from "./hooks/useModalState";

//Lazy Metronic initialization function
const lazyInitMetronic = () => {
  setTimeout(() => {
    if ((window as any).KTComponents) {
      (window as any).KTComponents.init();
      //(window as any).KTApp.init();
      (window as any).KTDrawer?.init();
      (window as any).KTMenu?.init();
      (window as any).KTScroll?.init();
      (window as any).KTSticky?.init();
      (window as any).KTSwapper?.init();
      (window as any).KTToggle?.init();
      (window as any).KTScrolltop?.init();
      (window as any).KTDialer?.init();
      (window as any).KTImageInput?.init();
      (window as any).KTPasswordMeter?.init();

      //Sidebar hover events with safe access
      const sidebar = document.querySelector("#kt_app_sidebar");
      if (sidebar && (window as any).KTToggle) {
        sidebar.addEventListener("mouseenter", () => {
          (window as any).KTToggle.hoverIn?.(sidebar);
        });
        sidebar.addEventListener("mouseleave", () => {
          (window as any).KTToggle.hoverOut?.(sidebar);
        });
      }
    }
  }, 300); //Delay to ensure full initialization
};

// Hook to reinitialize Metronic on navigation
const useMetronicInit = () => {
  const location = useLocation();

  /*useEffect(() => {
        lazyInitMetronic();  // Use the lazy initialization function
    }, [location]);*/ // Reinitialize Metronic on every route change
  useEffect(() => {
    const triggerResize = () => {
      window.dispatchEvent(new Event("resize"));
      //console.log("Triggered window resize event.");
    };

    // Trigger Metronic initialization and resize
    lazyInitMetronic();
    triggerResize();
  }, [location]);
};

function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <MetronicWrapper />
        <CommonModal />
      </ModalProvider>
    </BrowserRouter>
  );
}

// Wrapper component to use `useLocation` inside BrowserRouter
const MetronicWrapper: React.FC = () => {
  useMetronicInit(); // Initialize Metronic on navigation

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        {/*PublicRoutes()*/}
        {/* Auth Routes */}
        {AuthRoutes()}
        {/* Admin Routes */}
        {AdminRoutes()}
      </Routes>
    </div>
  );
};

export default App;
