import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const CheckoutForm = ({ price, clubId, eventId, clubName, eventTitle, type }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (price > 0) {
            axiosSecure.post("/create-payment-intent", { price })
                .then(res => setClientSecret(res.data.clientSecret));
        }
    }, [price, axiosSecure]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || processing) return;

        setProcessing(true);
        const card = elements.getElement(CardElement);

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card, billing_details: { email: user?.email, name: user?.displayName } }
        });

        if (error) {
            toast.error(error.message);
            setProcessing(false);
        } else if (paymentIntent.status === "succeeded") {
            const paymentInfo = {
                transactionId: paymentIntent.id,
                email: user?.email,
                price,
                date: new Date(),
                type, // 'membership' or 'event'
                ...(type === 'membership' ? { clubId, clubName } : { eventId, eventTitle })
            };

            const endpoint = type === 'membership' ? '/memberships' : '/events/register';
            const res = await axiosSecure.post(endpoint, paymentInfo);
            
            if (res.data.insertedId) {
                toast.success("Payment successful!");
                navigate('/dashboard/member-my-clubs');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-xl bg-gray-50"><CardElement /></div>
            <button 
                className="btn btn-primary w-full" 
                disabled={!stripe || !clientSecret || processing}
            >
                {processing ? "Processing..." : `Pay $${price} Now`}
            </button>
        </form>
    );
};

export default CheckoutForm;