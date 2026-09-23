import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = '170232858774-1ofu92nnr3q8frg5qbngaqlfsu71g2eu.apps.googleusercontent.com';

export default function GoogleSignInButton({ onAuthSuccess, role = 'student', text = 'Continue with Google' }) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const buttonContainerRef = useRef(null);

  useEffect(() => {
    const scriptId = 'google-jssdk';
    let script = document.getElementById(scriptId);

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
          });

          if (buttonContainerRef.current) {
            buttonContainerRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(buttonContainerRef.current, {
              theme: 'outline',
              size: 'large',
              width: 380,
              text: 'continue_with',
              shape: 'rectangular',
            });
            setScriptLoaded(true);
          }
        } catch (e) {
          void e;
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      initGoogle();
    }
  }, []);

  const handleCredentialResponse = async response => {
    if (!response?.credential) {
      toast.error('Google authentication failed');
      return;
    }

    setLoading(true);
    try {
      await onAuthSuccess(response.credential);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualGoogleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('Google Identity Service is loading, please try again.');
    }
  };

  return (
    <div className="w-full">
      <div 
        ref={buttonContainerRef} 
        className={`w-full flex justify-center [&>div]:w-full ${scriptLoaded ? 'min-h-[40px]' : 'hidden'}`} 
      />

      {!scriptLoaded && (
        <button
          type="button"
          disabled={loading}
          onClick={handleManualGoogleClick}
          className="w-full flex items-center justify-center gap-3 rounded-xl border py-2.5 px-4 text-xs font-semibold transition hover:opacity-90 shadow-sm active:scale-95 disabled:opacity-50"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
          }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Authenticating with Google...' : text}</span>
        </button>
      )}
    </div>
  );
}
