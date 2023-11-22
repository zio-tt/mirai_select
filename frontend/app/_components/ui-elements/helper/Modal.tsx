// Modal.tsx
import React from 'react';

const Modal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg" onClick={(e) => e.stopPropagation()}>
        <h1 className="font-bold text-lg">操作方法</h1>
        <p>ここに機能説明を入力します。</p>
        <button onClick={onClose} className="btn mt-4">閉じる</button>
      </div>
    </div>
  );
};

export default Modal;
