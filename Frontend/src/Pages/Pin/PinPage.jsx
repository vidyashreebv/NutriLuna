import React from 'react';
import { useNavigate } from 'react-router-dom';
import PinVerification from '../../Components/PinVerification/PinVerification';
import { useLoading } from '../../context/LoadingContext';

const PinPage = () => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoading();

    const handlePinVerified = async () => {
        showLoader();
        try {
            // After PIN verification, redirect to the intended page
            const intendedPath = localStorage.getItem('intendedPath') || '/landing';
            localStorage.removeItem('intendedPath'); // Clean up
            navigate(intendedPath);
        } finally {
            hideLoader();
        }
    };

    return <PinVerification onVerify={handlePinVerified} />;
};

export default PinPage;
