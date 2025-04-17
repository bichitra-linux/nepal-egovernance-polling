import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Government of Nepal. All rights reserved.</p>
                <p>e-Governance Polling System</p>
            </div>
        </footer>
    );
};

export default Footer;