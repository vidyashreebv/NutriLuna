import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './PinVerification.css';
import loginbg from '../../assets/loginbg.jpg';
import { API_ENDPOINTS } from '../../config/apiConfig';

const PinVerification = ({ onVerify }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [isPinSetup, setIsPinSetup] = useState(false);
    const [isSettingUp, setIsSettingUp] = useState(false);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const confirmInputRefs = [useRef(), useRef(), useRef(), useRef()];
    const { currentUser } = useAuth();

    useEffect(() => {
        checkPinStatus();
    }, []);

    const checkPinStatus = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(API_ENDPOINTS.PIN_STATUS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setIsPinSetup(response.data.isPinSet);
            setIsSettingUp(!response.data.isPinSet);
        } catch (error) {
            console.error('Error checking PIN status:', error);
            setError('Failed to check PIN status');
        }
    };

    const handlePinChange = (index, value, isConfirm = false) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }

        if (!/^\d*$/.test(value)) {
            return;
        }

        const newPin = isConfirm ? [...confirmPin] : [...pin];
        newPin[index] = value;
        isConfirm ? setConfirmPin(newPin) : setPin(newPin);
        setError('');

        if (value !== '' && index < 3) {
            const nextRefs = isConfirm ? confirmInputRefs : inputRefs;
            nextRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index, e, isConfirm = false) => {
        if (e.key === 'Backspace' && (isConfirm ? confirmPin : pin)[index] === '' && index > 0) {
            const prevRefs = isConfirm ? confirmInputRefs : inputRefs;
            prevRefs[index - 1].current?.focus();
        }
    };

    const handleSetPin = async () => {
        const enteredPin = pin.join('');
        const confirmedPin = confirmPin.join('');

        if (enteredPin !== confirmedPin) {
            setError('PINs do not match. Please try again.');
            setPin(['', '', '', '']);
            setConfirmPin(['', '', '', '']);
            inputRefs[0].current?.focus();
            return;
        }

        try {
            const token = await currentUser.getIdToken();
            await axios.post(API_ENDPOINTS.PIN_SET, 
                { pin: enteredPin },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setIsPinSetup(true);
            setIsSettingUp(false);
            localStorage.setItem('pinVerified', 'true');
            onVerify();
        } catch (error) {
            console.error('Error setting PIN:', error);
            setError('Failed to set PIN. Please try again.');
            setPin(['', '', '', '']);
            setConfirmPin(['', '', '', '']);
            inputRefs[0].current?.focus();
        }
    };

    const handleVerify = async () => {
        const enteredPin = pin.join('');
        
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.post(API_ENDPOINTS.PIN_VERIFY,
                { pin: enteredPin },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.isValid) {
                localStorage.setItem('pinVerified', 'true');
                onVerify();
            } else {
                setError('Incorrect PIN. Please try again.');
                setPin(['', '', '', '']);
                inputRefs[0].current?.focus();
            }
        } catch (error) {
            console.error('Error verifying PIN:', error);
            setError('Failed to verify PIN. Please try again.');
            setPin(['', '', '', '']);
            inputRefs[0].current?.focus();
        }
    };

    return (
        <div className="pin-verification-overlay">
            <div className="pin-verification-container">
                <h2>{isSettingUp ? 'Set Your PIN' : 'Enter PIN'}</h2>
                
                {isSettingUp ? (
                    <>
                        <p className="pin-setup-message">Create a 4-digit PIN to secure your account</p>
                        <div className="pin-input-container">
                            {pin.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="password"
                                    className="pin-input"
                                    value={digit}
                                    onChange={(e) => handlePinChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    maxLength={1}
                                    placeholder="•"
                                />
                            ))}
                        </div>

                        <div className="confirmation-input">
                            <p>Confirm your PIN</p>
                            <div className="pin-input-container">
                                {confirmPin.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={confirmInputRefs[index]}
                                        type="password"
                                        className="pin-input"
                                        value={digit}
                                        onChange={(e) => handlePinChange(index, e.target.value, true)}
                                        onKeyDown={(e) => handleKeyDown(index, e, true)}
                                        maxLength={1}
                                        placeholder="•"
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p>Please enter your 4-digit PIN to continue</p>
                        <div className="pin-input-container">
                            {pin.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="password"
                                    className="pin-input"
                                    value={digit}
                                    onChange={(e) => handlePinChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    maxLength={1}
                                    placeholder="•"
                                />
                            ))}
                        </div>
                    </>
                )}

                {error && <div className="error-message">{error}</div>}

                <button 
                    className="verify-button"
                    onClick={isSettingUp ? handleSetPin : handleVerify}
                    disabled={isSettingUp ? 
                        (pin.some(digit => digit === '') || confirmPin.some(digit => digit === '')) :
                        pin.some(digit => digit === '')}
                >
                    {isSettingUp ? 'Set PIN' : 'Verify'}
                </button>
            </div>
        </div>
    );
};

export default PinVerification;
