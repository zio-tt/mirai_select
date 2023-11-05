"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null)
  const [csrfTokenDebug, setCsrfTokenDebug] = useState('');

  async function getCsrfToken() {
    try {
      const response = await fetch('http://localhost:3000/csrf', {
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

  const handleGoogleSignIn = async () => {
    setError('');
    setDebugInfo(null); // 以前のデバッグ情報をクリア

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch('http://localhost:3000/users/auth/google_oauth2', {
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
    <div>
      {/* 既存のフォーム... */}
      <button type="button" onClick={handleGoogleSignIn}>Googleでサインイン</button>
      {/* エラーメッセージ */}
      {error && <p>{error}</p>}
      {/* CSRF_Tokenが正常に取得できているか確認 */}
      {csrfTokenDebug && (
        <div>
          <h2>CSRF_Token:</h2>
          <p>{csrfTokenDebug}</p>
        </div>
      )}
      {/* デバッグ情報 */}
      {debugInfo && (
        <div>
          <h2>デバッグ情報:</h2>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
