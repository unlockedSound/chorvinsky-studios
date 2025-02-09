import React from 'react';

const Header = () => {
    return (
        <header>
            <div className="relative bg-white dark:bg-gray-900">
                <div
                    className="max-w-7xl mx-0 px-4 py-2 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
                    <div className="flex sm:flex-row flex-col justify-between">
                        <div className="flex justify-start w-full">
                            <img className="h-10 w-auto sm:h-16"
                                 src="./logo_purple.svg"
                                 alt=""/>
                            <div className="pl-3 sm:pl-6 py-1 text-3xl sm:text-4xl align-middle font-extrabold my-auto text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-900 dark:from-purple-400 dark:to-indigo-300">
                                Chorvinsky Studios <span className="text-lg sm:text-xl">by&nbsp;David&nbsp;Chorvinsky</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
