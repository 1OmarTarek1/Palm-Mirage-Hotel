import React from 'react';
import { useLocation } from 'react-router-dom';
import { navLinks } from './Navbar/navLinks';

const DynamicTitle = ({ customTitle }) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  const getDynamicTitle = () => {
    if (customTitle) return customTitle;
    if (isHomePage) return "HOME";

    // 1. Search for a matching label in navigation links
    let foundLabel = "";
    const searchLinks = (links) => {
      for (const link of links) {
        // Normalize path for comparison
        const normalizedLinkHref = link.href.replace(/\/$/, "");
        const normalizedPathname = pathname.replace(/\/$/, "");
        
        if (normalizedLinkHref === normalizedPathname) {
          foundLabel = link.label;
          return true;
        }
        if (link.megaMenu?.links && searchLinks(link.megaMenu.links)) return true;
        if (link.dropdown && searchLinks(link.dropdown)) return true;
      }
      return false;
    };

    searchLinks(navLinks);
    if (foundLabel) return foundLabel.toUpperCase();

    // 2. Fallback: Format the last part of the path
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment) {
      // If the last segment is a number (likely an ID), use the parent segment + "Details"
      if (/^\d+$/.test(lastSegment) && pathSegments.length > 1) {
        const parentSegment = pathSegments[pathSegments.length - 2];
        return `${parentSegment.replace(/-/g, " ")} Details`.toUpperCase();
      }
      
      return lastSegment
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .toUpperCase();
    }

    return "HOME";
  };

  const displayTitle = getDynamicTitle();

  return (
    <h1 className='text-3xl sm:text-4xl md:text-5xl font-header text-foreground font-bold mb-0'>
      {displayTitle}
    </h1>
  );
};

export default DynamicTitle;
