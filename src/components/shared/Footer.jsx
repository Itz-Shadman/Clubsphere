// src/components/shared/Footer.jsx
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="footer p-10 bg-neutral text-neutral-content">
            <aside>
                <Link to="/" className="text-2xl font-bold text-clubsphere-primary">
                    ClubSphere
                </Link>
                <p className='mt-2'>
                    ClubSphere Ltd.<br/>Connecting you to local passions since 2024.
                    <br/>
                    All rights reserved.
                </p>
            </aside>
            <nav>
                <h6 className="footer-title">Quick Links</h6>
                <Link to="/clubs" className="link link-hover">Clubs</Link>
                <Link to="/events" className="link link-hover">Events</Link>
                <Link to="/pricing" className="link link-hover">Pricing</Link>
                <Link to="/how-it-works" className="link link-hover">How It Works</Link>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
                <a className="link link-hover">Cookie policy</a>
            </nav>
            <nav>
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4">
                    <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
                        <FaGithub className='w-6 h-6 hover:text-clubsphere-primary transition-colors' />
                    </a>
                    <a href="https://linkedin.com/in/your-username" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn className='w-6 h-6 hover:text-clubsphere-primary transition-colors' />
                    </a>
                    {/* Use the latest X logo as required */}
                    <a href="https://x.com/your-username" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter className='w-6 h-6 hover:text-clubsphere-primary transition-colors' />
                    </a>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;