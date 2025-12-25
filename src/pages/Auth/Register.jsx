// src/pages/Auth/Register.jsx
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router'; // CORRECTED: use 'react-router-dom'
import { FaGoogle } from 'react-icons/fa6';
// CORRECTED IMPORT: Import useAuth as a default export from the hooks folder
import useAuth from '../../hooks/useAuth'; 
import toast from 'react-hot-toast';
import useAxiosPublic from '../../hooks/useAxiosPublic'; 
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';

const Register = () => {
    // CORRECT USAGE: Destructure the correct function names from AuthProvider
    const { createUser, updateUserProfile, googleSignIn } = useAuth();
    const axiosCommon = useAxiosPublic(); 
    const navigate = useNavigate();

    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset 
    } = useForm();
    
    // TanStack Mutation for storing user in DB
    const registerDBMutation = useMutation({
        mutationFn: (userData) => axiosCommon.post('/users', userData),
        onSuccess: (data) => {
            console.log("User saved to DB:", data);
            toast.success("Registration successful! Welcome to ClubSphere.");
            reset();
            // Redirect to dashboard or home after successful registration/login
            navigate('/'); 
        },
        onError: (error) => {
            console.error("DB Registration Error:", error);
            toast.error("Registration failed. Please try again.");
            // In a real scenario, you might want to log out the user here if DB saving failed.
        }
    });

    const onSubmit = async (data) => {
        const toastId = toast.loading('Registering...');
        
        try {
            // 1. Firebase Register: Using the correct function name 'createUser'
            const result = await createUser(data.email, data.password);
            
            // 2. Update Firebase Profile: Using the correct function name 'updateUserProfile'
            await updateUserProfile(data.name, data.photoURL);

            // 3. Store user in MongoDB (Default role: 'member')
            const userData = {
                name: data.name,
                email: result.user.email,
                photoURL: data.photoURL,
                role: 'member',
            };
            
            registerDBMutation.mutate(userData);
            
            toast.dismiss(toastId);

        } catch (error) {
            toast.dismiss(toastId);
            // Show user-friendly error messages
            const firebaseErrorMsg = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
            toast.error(`Registration failed: ${firebaseErrorMsg}`);
        }
    };
    
    const handleSocialLogin = (socialFn) => {
        socialFn()
            .then(result => {
                const loggedUser = result.user;
                // Store user in DB after social login
                const userData = {
                    name: loggedUser.displayName,
                    email: loggedUser.email,
                    photoURL: loggedUser.photoURL,
                    role: 'member',
                };
                
                // This triggers the DB save and, upon success, redirects home
                registerDBMutation.mutate(userData); 
            })
            .catch(error => {
                const firebaseErrorMsg = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
                toast.error(`Social Login failed: ${firebaseErrorMsg}`);
            });
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <Helmet>
                <title>ClubSphere | Register</title>
            </Helmet>
            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-4xl">
                <div className="text-center lg:text-left p-8">
                    <h1 className="text-5xl font-bold text-clubsphere-primary">Join ClubSphere!</h1>
                    <p className="py-6 text-gray-600">
                        Register now to discover local clubs, manage your memberships, and never miss an event.
                    </p>
                    <img 
                        // FIX: Replaced broken URL with a stable, relevant illustration URL
                        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="Join Club Illustration (Community)" 
                        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                    />
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <h2 className="text-3xl font-bold mb-4">Create Account</h2>
                        
                        {/* Name Field */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name</span></label>
                            <input type="text" placeholder="Your Name" className="input input-bordered" 
                                {...register("name", { required: "Name is required" })} 
                            />
                            {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        
                        {/* Photo URL Field */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Photo URL (Optional)</span></label>
                            <input type="url" placeholder="http://example.com/photo.jpg" className="input input-bordered" 
                                {...register("photoURL")} 
                            />
                        </div>
                        
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" placeholder="email@example.com" className="input input-bordered" 
                                {...register("email", { required: "Email is required" })} 
                            />
                            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        
                        {/* Password Field with Validation */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" placeholder="password" className="input input-bordered" 
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters required" },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                                        message: "Must contain at least one uppercase and one lowercase letter"
                                    }
                                })} 
                            />
                            {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
                        </div>
                        
                        <div className="form-control mt-6">
                            <button className="btn bg-clubsphere-primary text-white hover:bg-clubsphere-accent" type="submit" disabled={registerDBMutation.isPending}>
                                {registerDBMutation.isPending ? 'Registering...' : 'Register'}
                            </button>
                        </div>

                        <p className='text-center mt-4'>Already have an account? <Link to="/login" className="text-clubsphere-primary font-bold hover:underline">Login</Link></p>
                        
                        <div className="divider">OR</div>
                        
                        <button 
                            type="button" 
                            onClick={() => handleSocialLogin(googleSignIn)} // Use googleSignIn from AuthProvider
                            className="btn btn-outline btn-info hover:text-white"
                        >
                            <FaGoogle />
                            Login with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;