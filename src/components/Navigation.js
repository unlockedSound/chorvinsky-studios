import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    // Base styles for each nav item
    const baseClasses = "px-3 py-0 rounded-full font-medium transition-colors duration-300";
    // Classes for the active nav item
    const activeClasses = "text-indigo-600";
    // Classes for an inactive nav item (with hover effect)
    const inactiveClasses = "text-black dark:text-gray-300 hover:text-indigo-600";
    // The indicator element to show for the active link.
    const indicator = (
        <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-indigo-600/0 via-indigo-600/40 to-indigo-600/0 dark:from-indigo-400/0 dark:via-indigo-400/40 dark:to-indigo-400/0" />
    );

    return (
        <nav className="flex justify-center pt-4 pb-8 dark:bg-gray-900">
            {/* A container with a pill-shaped background */}
            <div className="bg-white/90 dark:bg-zinc-700/40 rounded-full px-3 text-sm font-medium inline-flex shadow-md ">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
                    }
                >
                    {({ isActive }) => (
                        <div className="relative">
                            <span>Home</span>
                            {isActive && indicator}
                        </div>
                    )}
                </NavLink>
                <NavLink
                    to="/film"
                    className={({ isActive }) =>
                        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
                    }
                >
                    {({ isActive }) => (
                        <div className="relative">
                            <span>Film</span>
                            {isActive && indicator}
                        </div>
                    )}
                </NavLink>
            </div>
        </nav>
    );
};

export default Navigation;
