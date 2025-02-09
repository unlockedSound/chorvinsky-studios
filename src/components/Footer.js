import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-black" aria-labelledby="footer-heading">
            <div className="max-w-7xl mx-auto pb-5 px-4 sm:px-6 lg:px-8 pt-4">
                <div
                    className="md:flex md:items-center md:justify-between">
                    <p className="mt-8 text-base text-gray-600 dark:text-white md:mt-0 md:order-1">
                        &copy; 2025 Chorvinsky Studios by David Chorvinsky, All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
