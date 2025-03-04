import React, { createContext, useContext, useState } from 'react';
import Loader from '../Components/Loader';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {isLoading && <Loader />}
            {children}
        </LoadingContext.Provider>
    );
};
