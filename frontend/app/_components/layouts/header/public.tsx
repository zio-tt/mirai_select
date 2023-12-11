import handleLogin from '@/app/_features/handleLogin';

const PublicHeader = () => {
  return (
    <>
      <div className="fixed left-4 justify-center ml-16">
        <a href="/" className="text-xl hover:underline ml-2">ミライセレクト</a>
        <p className='text-xs'>あなたの選択をサポートする</p>
      </div>
      <div className="fixed right-4 mr-16">
        <a href="" onClick={handleLogin} className="text-bs hover:underline mr-2 ml-4">Google認証</a>
      </div>
    </>
  );
}

export default PublicHeader;