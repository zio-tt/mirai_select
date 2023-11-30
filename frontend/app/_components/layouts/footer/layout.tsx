"use client"

import React from 'react';

export default function Footer() {
  return (
    <div className='flex h-full w-screen items-center justify-center' data-theme="dark">
      <footer className="footer footer-center p-5 bg-base-200 text-base-content rounded">
        <nav className="grid grid-flow-col gap-4">
          <a href="https://forms.gle/5529xgmL49n93grn9" className="link link-hover">お問い合わせ</a>
          <a href="/privacy-policy" className="link link-hover">プライバシーポリシー</a>
          <a href="/terms-of-service" className="link link-hover">利用規約</a>
        </nav>
      </footer>
    </div>
  );
}