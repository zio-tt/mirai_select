"use client"
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showLogo, setShowLogo] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null)
  const [csrfTokenDebug, setCsrfTokenDebug] = useState('');
  const router = useRouter();

  async function getCsrfToken() {
    try {
      const response = await fetch('http://localhost/manage/csrf', {
        credentials: 'include'
      });
      const data = await response.json();
      setCsrfTokenDebug(data.csrfToken); // 取得したCSRFトークンをstateに保存
      return data.csrfToken;
    } catch (error) {
      setError('CSRFトークンの取得に失敗しました。');
      setCsrfTokenDebug('取得失敗'); // エラーが発生した場合はその旨をstateに保存
    }
  }

  const firstVisitAnimate = () => {
    const fadeInLogoTimer = setTimeout(() => {
      setLogoOpacity(1);
    }, 1000);

    const fadeOutLogoTimer = setTimeout(() => {
      setLogoOpacity(0);
    }, 2000);

    const fadeInContentTimer = setTimeout(() => {
      setShowContent(true);
      setShowLogo(false);
      setContentOpacity(1);
    }, 3000);


    return () => {
      clearTimeout(fadeInLogoTimer);
      clearTimeout(fadeOutLogoTimer);
      clearTimeout(fadeInContentTimer);
    };
  }

  const visitedAnimate = () => {
    setShowLogo(false);

    const fadeInContentTimer = setTimeout(() => {
      setShowContent(true);
      setContentOpacity(1);
    }, 1000);

    return () => {
      clearTimeout(fadeInContentTimer);
    }
  }

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited === 'true') {
      visitedAnimate()
      return
    }
    firstVisitAnimate()
    sessionStorage.setItem('hasVisited', 'true');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleSignIn = async () => {
    setError('');
    setDebugInfo(null); // 以前のデバッグ情報をクリア

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch('http://localhost/manage/users/auth/google_oauth2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json(); // もしくはresponse.urlからリダイレクト先のURLを取得
        // Google認証ページへのリダイレクトを実行
        window.location.href = data.redirectUrl;
      } else {
        // エラー処理
        const errorData = await response.json();
        setError(errorData.message || 'Google認証に失敗しました。');
        setDebugInfo(errorData);
      }
    } catch (error) {
      // ネットワークエラーなど、リクエスト自体が失敗した場合の処理
      setError('リクエストに失敗しました。');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div
          className={'transform transition-opacity duration-1000'}
          style={{ display: showContent ? 'none' : 'block', opacity: logoOpacity }}
        >
          {showLogo && (
            <Image src="/images/logo_ilust.png" alt="Logo" width={500} height={500} style = {{ objectFit: "contain" }} />
          )}
        </div>

        {!isLoading && (
          <div className="transition-opacity duration-1000" style={{ opacity: contentOpacity }}>
            <button
              onClick={handleGoogleSignIn} // ここでGoogleサインインの処理を実行
              className="mt-5 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              アカウントを作成する（Google認証）
            </button>

            {/* エラーメッセージの表示 */}
            {error && <p>{error}</p>}
            {/* CSRFトークンのデバッグ情報 */}
            {csrfTokenDebug && (
              <div>
                <h2>CSRF_Token:</h2>
                <p>{csrfTokenDebug}</p>
              </div>
            )}
            {debugInfo && (
              <div>
                <h2>Debug_Info:</h2>
                <p>{debugInfo}</p>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
            <span className="loading loading-spinner text-primary"></span>
            <span className="loading loading-spinner text-secondary"></span>
            <span className="loading loading-spinner text-accent"></span>
            <span className="loading loading-spinner text-neutral"></span>
            <span className="loading loading-spinner text-info"></span>
            <span className="loading loading-spinner text-success"></span>
            <span className="loading loading-spinner text-warning"></span>
            <span className="loading loading-spinner text-error"></span>
          </div>
        )}
      </div>
    </>
  );
}