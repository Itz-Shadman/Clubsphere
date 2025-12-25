import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, Navigate } from "react-router";
import CheckoutForm from "./CheckoutForm";
import { Helmet } from "react-helmet-async";

// FIX: Ensure the key is read correctly from Vite env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || "");

const Payment = () => {
    const location = useLocation();
    const data = location.state;

    // Prevention: If someone reloads the page, the state is lost
    if (!data || !data.price) return <Navigate to="/dashboard/member-overview" />;

    return (
        <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-3xl shadow-xl">
            <Helmet><title>Checkout | ClubSphere</title></Helmet>
            <h2 className="text-3xl font-black text-center text-gray-800 mb-2">Secure Payment</h2>
            <p className="text-center text-gray-500 mb-8">For: {data.clubName}</p>
            
            <div className="bg-blue-50 p-4 rounded-2xl mb-8 flex justify-between items-center">
                <span className="font-bold text-blue-800">Total Due:</span>
                <span className="text-2xl font-black text-blue-900">${data.price}</span>
            </div>

            <Elements stripe={stripePromise}>
                <CheckoutForm {...data} />
            </Elements>
        </div>
    );
};

export default Payment;