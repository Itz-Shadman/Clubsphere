// src/pages/ErrorPage.jsx (FIXED)

import { Helmet } from "react-helmet-async";
import { useRouteError } from "react-router"; // Assuming you use useRouteError

const ErrorPage = () => {
    // This hook provides the error object, which might be null or lack properties
    const error = useRouteError(); 
    
    // Ensure error message is extracted safely, providing fallbacks
    const errorMessage = error?.message || error?.statusText || 'Unknown Error';
    const errorStatus = error?.status || '500';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <Helmet>
                {/* FIX APPLIED HERE: 
                  Always use a fallback string ('Error') to satisfy Helmet's invariant. 
                */}
                <title>
                    {errorStatus} - {error?.statusText || 'Error'} | ClubSphere 
                </title>
            </Helmet>
            
            <h1 className="text-9xl font-extrabold text-clubsphere-primary">
                {errorStatus}
            </h1>
            <p className="text-2xl font-semibold mb-4 text-gray-700">
                Oops! {error?.statusText || "Something went wrong."}
            </p>
            <p className="text-lg text-red-500 mb-6 font-mono">
                {errorMessage}
            </p>
            {/* ... rest of your ErrorPage content ... */}
        </div>
    );
};

export default ErrorPage;