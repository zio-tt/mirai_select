export default function PrivacyPolicy() {
  const h2Style = 'text-md md:text-lg lg:text-2xl underline';
  const h3Style = 'text-sm md:text-md lg:text-xl ml-4';
  const liStyle  = 'text-xs md:text-sm lg:text-lg';

  return (
    <>
      <div className='flex items-center justify-center w-screen min-h-screen overscroll-none'>
        <div className="flex flex-col items-center justify-center w-[80vw] h-[80vh] my-[5vh]">
          <div className="h-full w-full bg-gray-200/30 backdrop-blur-lg
          rounded-md border border-gray-200/30 shadow-lg
          flex flex-col justify-start py-[3vh] px-[3vw] overflow-auto">
            <div className='flex text-left text-gray-500 text-lg md:text-2xl lg:text-4xl underline mb-[3vh]'>
              <h1>プライバシーポリシー</h1>
            </div>
            <div className='flex text-left text-gray-500'>
              <ul>
                <h2 className={h2Style}>お客様から取得する情報</h2>
                <h3 className={h3Style}>当社は、お客様から以下の情報を取得します。</h3>
                <ul className="list-disc ml-12">
                  <li className={liStyle}>氏名(ニックネームやペンネームも含む)</li>
                  <li className={liStyle}>メールアドレス</li>
                  <li className={liStyle}>写真や動画</li>
                  <li className={liStyle}>外部サービスでお客様が利用するID、その他外部サービスのプライバシー設定によりお客様が連携先に開示を認めた情報</li>
                  <li className={liStyle}>Cookie(クッキー)を用いて生成された識別情報</li>
                  <li className={liStyle}>OSが生成するID、端末の種類、端末識別子等のお客様が利用するOSや端末に関する情報</li>
                  <li className={liStyle}>当社ウェブサイトの滞在時間、入力履歴、購買履歴等の当社ウェブサイトにおけるお客様の行動履歴</li>
                  <li className={liStyle}>当社アプリの起動時間、入力履歴、購買履歴等の当社アプリの利用履歴</li>
                </ul>
                <br />
                <h2 className={h2Style}>お客様の情報を利用する目的</h2>
                <h3 className={h3Style}>当社は、お客様から取得した情報を、以下の目的のために利用します。</h3>
                <ul className="list-disc ml-12">
                  <li className={liStyle}>当社サービスに関する登録の受付、お客様の本人確認、認証のため</li>
                  <li className={liStyle}>お客様の当社サービスの利用履歴を管理するため</li>
                  <li className={liStyle}>利用料金の決済のため</li>
                  <li className={liStyle}>当社サービスにおけるお客様の行動履歴を分析し、当社サービスの維持改善に役立てるため</li>
                  <li className={liStyle}>当社のサービスに関するご案内をするため</li>
                  <li className={liStyle}>お客様からのお問い合わせに対応するため</li>
                  <li className={liStyle}>当社の規約や法令に違反する行為に対応するため</li>
                  <li className={liStyle}>当社サービスの変更、提供中止、終了、契約解除をご連絡するため</li>
                  <li className={liStyle}>当社規約の変更等を通知するため</li>
                  <li className={liStyle}>以上の他、当社サービスの提供、維持、保護及び改善のため</li>
                </ul>
                <br />
                <h2 className={h2Style}>安全管理のために講じた措置</h2>
                <h3 className={h3Style}>当社が、お客様から取得した情報に関して安全管理のために講じた措置につきましては、末尾記載のお問い合わせ先にご連絡をいただきましたら、法令の定めに従い個別にご回答させていただきます。</h3>
                <br />
                <h2 className={h2Style}>第三者提供</h2>
                <h3 className={h3Style}>当社は、お客様から取得する情報のうち、個人データ（個人情報保護法第１６条第３項）に該当するものついては、あらかじめお客様の同意を得ずに、第三者（日本国外にある者を含みます。）に提供しません。</h3>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}