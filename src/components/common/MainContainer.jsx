import React from 'react';
import { useLocation } from 'react-router-dom';
import AppBreadcrumb from './AppBreadcrumb';
import { cn } from "@/lib/utils";
import DynamicTitle from './DynamicTitle';


const MainContainer = ({ children, className = "", showBreadcrumb = true, showHeader = true, title: customTitle }) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const hideHeader = isHome || pathname === "/services/activities" || !showHeader;

  return (
    <div className={cn(
      `w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-4 lg:px-5 xl:px-2 ${!isHome && "mb-15"} ${!hideHeader && "pt-30"}`,
      className
    )}>
      {!hideHeader && (
        <div className="flex flex-col items-center text-center mb-10">
          <DynamicTitle customTitle={customTitle} />
          {showBreadcrumb && <AppBreadcrumb />}
        </div>
      )}
      <div className={cn(!hideHeader && "mt-0")}>
        {children}
      </div>
    </div>
  );
};

export default MainContainer;
