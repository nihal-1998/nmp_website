import Footer from "@/components/Shared/Footer";
import Navbar from "@/components/Shared/Navbar";
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};
const layout = ({ children }: LayoutProps) => {


  
  return (
    <div>
      
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
