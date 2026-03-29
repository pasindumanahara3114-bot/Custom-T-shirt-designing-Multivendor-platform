import React, { useState } from 'react';
import { CreditCard, Calendar, Lock, X, CheckCircle2, Loader2 } from 'lucide-react';

const PaymentModal = ({ amount, onPaymentSuccess, onCancel }) => {
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        let formattedValue = value;
        // Basic formatting for aesthetics
        if (name === 'number') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
        } else if (name === 'expiry') {
            formattedValue = value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setCardDetails(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const handlePayment = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (cardDetails.number.length < 15 || !cardDetails.name || cardDetails.expiry.length < 5 || cardDetails.cvv.length < 3) {
            alert('Please fill out all card details properly.');
            return;
        }

        setProcessing(true);

        // Simulate network delay for processing
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            
            // Wait 1.5 seconds on success screen before triggering callback
            setTimeout(() => {
                onPaymentSuccess();
            }, 1500);
        }, 2000);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div className="glass" style={{
                width: '100%', maxWidth: '440px',
                padding: '32px',
                borderRadius: '24px',
                position: 'relative',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {!success && !processing && (
                    <button 
                        onClick={onCancel}
                        style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>
                )}

                {success ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', animation: 'fadeIn 0.4s ease-out' }}>
                        <div style={{ 
                            width: '80px', height: '80px', borderRadius: '50%', 
                            background: 'rgba(16, 185, 129, 0.1)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}>
                            <CheckCircle2 size={40} color="#10b981" />
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#10b981' }}>Payment Successful!</h2>
                        <p style={{ color: 'var(--muted)' }}>Processing your order now...</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Secure Payment</h2>
                            <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Total Amount to Pay</p>
                            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent2)', marginTop: '8px' }}>
                                Rs. {(amount || 0).toLocaleString()}
                            </div>
                        </div>

                        <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cardholder Name</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="text" name="name" required className="field"
                                        placeholder="John Doe"
                                        value={cardDetails.name} onChange={handleInputChange}
                                        style={{ width: '100%', paddingLeft: '44px' }}
                                        disabled={processing}
                                    />
                                    <UserIcon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                </div>
                            </div>

                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Card Number</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="text" name="number" required className="field"
                                        placeholder="0000 0000 0000 0000"
                                        value={cardDetails.number} onChange={handleInputChange}
                                        style={{ width: '100%', paddingLeft: '44px', fontFamily: 'monospace', fontSize: '16px' }}
                                        disabled={processing}
                                    />
                                    <CreditCard size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expiry Date</label>
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type="text" name="expiry" required className="field"
                                            placeholder="MM/YY"
                                            value={cardDetails.expiry} onChange={handleInputChange}
                                            style={{ width: '100%', paddingLeft: '44px', fontFamily: 'monospace' }}
                                            disabled={processing}
                                        />
                                        <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                    </div>
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CVV</label>
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type="password" name="cvv" required className="field"
                                            placeholder="•••"
                                            value={cardDetails.cvv} onChange={handleInputChange}
                                            style={{ width: '100%', paddingLeft: '44px', fontFamily: 'monospace', letterSpacing: '4px' }}
                                            disabled={processing}
                                        />
                                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="primaryBtn" 
                                style={{ 
                                    width: '100%', marginTop: '12px', padding: '16px', fontSize: '16px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                }}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 size={20} className="spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={18} />
                                        Pay Rs. {(amount || 0).toLocaleString()}
                                    </>
                                )}
                            </button>
                            
                            <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)' }}>
                                Dummy Payment Gateway • No real money is captured
                            </div>
                        </form>
                    </>
                )}
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// Quick mock for User icon since it's not imported directly in the modal component
const UserIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export default PaymentModal;
