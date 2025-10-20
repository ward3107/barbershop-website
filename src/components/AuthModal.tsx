import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const { language } = useLanguage();

  const texts = {
    en: {
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      phone: 'Phone Number (Optional)',
      loginButton: 'Login',
      signupButton: 'Create Account',
      googleLogin: 'Continue with Google',
      facebookLogin: 'Continue with Facebook',
      appleLogin: 'Continue with Apple',
      microsoftLogin: 'Continue with Microsoft',
      switchToSignup: "Don't have an account? Sign up",
      switchToLogin: 'Already have an account? Login',
      errorTitle: 'Error',
      successTitle: 'Success!',
      loginSuccess: 'Welcome back!',
      signupSuccess: 'Account created successfully!'
    },
    ar: {
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      name: 'الاسم الكامل',
      phone: 'رقم الهاتف (اختياري)',
      loginButton: 'تسجيل الدخول',
      signupButton: 'إنشاء حساب',
      googleLogin: 'المتابعة مع جوجل',
      facebookLogin: 'المتابعة مع فيسبوك',
      appleLogin: 'المتابعة مع أبل',
      microsoftLogin: 'المتابعة مع مايكروسوفت',
      switchToSignup: 'ليس لديك حساب؟ سجل الآن',
      switchToLogin: 'لديك حساب بالفعل؟ سجل الدخول',
      errorTitle: 'خطأ',
      successTitle: 'نجح!',
      loginSuccess: 'مرحباً بعودتك!',
      signupSuccess: 'تم إنشاء الحساب بنجاح!'
    },
    he: {
      login: 'התחברות',
      signup: 'הרשמה',
      email: 'אימייל',
      password: 'סיסמה',
      name: 'שם מלא',
      phone: 'מספר טלפון (אופציונלי)',
      loginButton: 'התחבר',
      signupButton: 'צור חשבון',
      googleLogin: 'המשך עם Google',
      facebookLogin: 'המשך עם Facebook',
      appleLogin: 'המשך עם Apple',
      microsoftLogin: 'המשך עם Microsoft',
      switchToSignup: 'אין לך חשבון? הירשם',
      switchToLogin: 'כבר יש לך חשבון? התחבר',
      errorTitle: 'שגיאה',
      successTitle: 'הצלחה!',
      loginSuccess: 'ברוך שובך!',
      signupSuccess: 'חשבון נוצר בהצלחה!'
    }
  };

  const text = texts[language as keyof typeof texts];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signup(email, password, displayName, phone);
      }
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setPhone('');
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => onOpenChange(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700]/30 rounded-2xl max-w-md w-full p-8 relative overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(196,165,114,0.1)_0%,transparent_50%)]" />

          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#FFD700] transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#C4A572] rounded-full flex items-center justify-center mx-auto mb-4"
              >
                {isLogin ? (
                  <LogIn className="w-8 h-8 text-black" />
                ) : (
                  <UserPlus className="w-8 h-8 text-black" />
                )}
              </motion.div>
              <h2 className="text-3xl font-bold text-[#FFD700] mb-2">
                {isLogin ? text.login : text.signup}
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    {text.name}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-black/50 border border-[#FFD700]/30 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                      placeholder={text.name}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  {text.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-[#FFD700]/30 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                    placeholder={text.email}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  {text.password}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-[#FFD700]/30 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                    placeholder={text.password}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    {text.phone}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/50 border border-[#FFD700]/30 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                      placeholder={text.phone}
                      dir="ltr"
                    />
                  </div>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  isLogin ? text.loginButton : text.signupButton
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#FFD700]/30" />
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-[#FFD700]/30" />
            </div>

            {/* Google Login */}
            <motion.button
              onClick={handleGoogleLogin}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-white/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {text.googleLogin}
            </motion.button>

            {/* Toggle Mode */}
            <button
              onClick={toggleMode}
              className="w-full text-center text-gray-400 hover:text-[#FFD700] transition-colors mt-6 text-sm"
            >
              {isLogin ? text.switchToSignup : text.switchToLogin}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
