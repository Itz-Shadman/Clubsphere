// src/pages/ErrorPage.jsx (FIXED)

import { Helmet } from "react-helmet-async";
import { useRouteError } from "react-router";

const ErrorPage = () => {
   
    const error = useRouteError(); 

    const errorMessage = error?.message || error?.statusText || 'Unknown Error';
    const errorStatus = error?.status || '500';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <Helmet>
              
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
          
        </div>
    );
};

export default ErrorPage;