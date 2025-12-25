// src/components/LoadingSpinner.jsx
const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-base-200">
            <div className="flex flex-col items-center space-y-4">
                {/* DaisyUI spinner */}
                <span className="loading loading-spinner loading-lg text-clubsphere-primary"></span>
                <p className="text-lg font-semibold text-gray-700 animate-pulse">
                    ClubSphere is loading...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;