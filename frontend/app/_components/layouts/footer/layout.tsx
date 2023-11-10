import React, { Component } from 'react';

export default function Footer() {
  return (
    <footer className='h-12 items-center justify-center w-max'>
      <div className="fixed bottom-4 right-4">
        <a href="https://forms.gle/5529xgmL49n93grn9" className="text-sm text-gray-600 hover:underline">お問い合わせ</a>
        <a href="/privacy-policy" className="text-sm text-gray-600 hover:underline ml-4">プライバシーポリシー</a>
        <a href="/terms-of-service" className="text-sm text-gray-600 hover:underline mr-2 ml-4">利用規約</a>
      </div>
    </footer>
  );
}