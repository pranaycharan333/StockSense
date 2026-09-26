import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boxes, Mail, KeyRound, Lock, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordResetOtp, verifyOtp, resetPassword } = useAuth();

  // Step 1: Email, Step 2: OTP, Step 3: New Password, Step 4: Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('elena.r@stocksense.io');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Timer for resend OTP
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Handle Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide your registered account email.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await requestPasswordResetOtp(email);
      setGeneratedOtp(res.otp);
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.message || 'Unable to generate reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
    }
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      setIsLoading(true);
      await verifyOtp(email, fullOtp);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick auto-fill OTP for test evaluation
  const handleAutoFillOtp = () => {
    const code = generatedOtp || '482910';
    setOtp(code.split(''));
  };

  // Handle Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email, newPassword);
      setStep(4);
      // Auto-redirect to dashboard after 2.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg">
            <Boxes className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">StockSense</span>
        </div>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-white">
          {step === 1 && 'Reset your password'}
          {step === 2 && 'Verify 6-digit OTP'}
          {step === 3 && 'Choose a new password'}
          {step === 4 && 'Password Reset Complete!'}
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-400">
          {step === 1 && 'We will send a one-time verification code to your email'}
          {step === 2 && `Enter the OTP sent to ${email}`}
          {step === 3 && 'Create a strong password for your inventory account'}
          {step === 4 && 'Your credentials have been updated successfully'}
        </p>

        {/* Multi-step progress dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? 'w-8 bg-teal-500'
                  : step > s
                  ? 'w-4 bg-teal-700'
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-850 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800 text-slate-200">

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= STEP 1: ENTER EMAIL ================= */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Registered Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Generating OTP...' : 'Send Verification OTP'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}

          {/* ================= STEP 2: VERIFY OTP ================= */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* Simulated OTP Display Banner for Hackathon Demo */}
              <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-teal-300">Simulated Email OTP</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 underline"
                  >
                    Auto-Fill
                  </button>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-slate-300">
                    Your 6-digit security code is:
                  </p>
                  <span className="font-mono text-base font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded border border-teal-500/40">
                    {generatedOtp || '482910'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-12 text-center text-lg font-bold font-mono bg-slate-900 border border-slate-700 rounded-lg text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Didn't receive code?</span>
                {countdown > 0 ? (
                  <span className="text-slate-500">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="text-teal-400 hover:text-teal-300 font-semibold"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Verifying Code...' : 'Verify OTP Code'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Change email address
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3: NEW PASSWORD ================= */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Secure Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Password strength checklist */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span className={newPassword.length >= 6 ? 'text-emerald-400' : 'text-slate-400'}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${newPassword && newPassword === confirmPassword ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span className={newPassword && newPassword === confirmPassword ? 'text-emerald-400' : 'text-slate-400'}>
                    Passwords match
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Updating Credentials...' : 'Save Password & Go to Dashboard'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 4: SUCCESS ================= */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[2]" />
              </div>

              <h3 className="text-lg font-bold text-white">Password Updated!</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Your new credentials are saved. Redirecting to your Inventory Dashboard...
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Launch Inventory Dashboard Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
