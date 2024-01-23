export default function PrivacyPolicy() {
  const h2Style = 'text-md md:text-md lg:text-lg underline';
  const h3Style = 'text-sm md:text-sm lg:text-md ml-4';
  const liStyle = 'text-xs md:text-xs lg:text-sm';

  type ContentsProps = {
    title?: string;
    subtitle?: string;
    contents?: string[];
  }

  const Contents = ({ title, subtitle, contents }: ContentsProps) => {
    return (
      <div className='mb-[1rem]'>
        {title && <h2 className={h2Style}>{title}</h2>}
        {subtitle && <h3 className={h3Style}>{subtitle.split('\n').map((line, index) => (
          <div key={index}>
            {line}
            <br />
          </div>
        ))}</h3>}
        {contents && <ul className='list-disc ml-12'>{contents.map((content, index) => (
          <li key={index} className={liStyle}>{content}</li>
        ))}</ul>}
      </div>
    )
  }

  const sections = [
    {
      title:
        `お客様から取得する情報`,
      subtitle:
        `当社は、お客様から以下の情報を取得します。`,
      contents:
        [
          `氏名(ニックネームやペンネームも含む)`,
          `メールアドレス`,
          `写真や動画`,
          `外部サービスでお客様が利用するID、その他外部サービスのプライバシー設定によりお客様が連携先に開示を認めた情報`,
          `Cookie(クッキー)を用いて生成された識別情報`,
          `OSが生成するID、端末の種類、端末識別子等のお客様が利用するOSや端末に関する情報`,
          `当社ウェブサイトの滞在時間、入力履歴、購買履歴等の当社ウェブサイトにおけるお客様の行動履歴`,
          `当社アプリの起動時間、入力履歴、購買履歴等の当社アプリの利用履歴`,
        ]
    },
    {
      title:
        `お客様の情報を利用する目的`,
      subtitle:
        `当社は、お客様から取得した情報を、以下の目的のために利用します。`,
      contents:
        [
          `当社サービスに関する登録の受付、お客様の本人確認、認証のため`,
          `お客様の当社サービスの利用履歴を管理するため`,
          `利用料金の決済のため`,
          `当社サービスにおけるお客様の行動履歴を分析し、当社サービスの維持改善に役立てるため`,
          `当社のサービスに関するご案内をするため`,
          `お客様からのお問い合わせに対応するため`,
          `当社の規約や法令に違反する行為に対応するため`,
          `当社サービスの変更、提供中止、終了、契約解除をご連絡するため`,
          `当社規約の変更等を通知するため`,
          `以上の他、当社サービスの提供、維持、保護及び改善のため`,
        ]
    },
    {
      title:
        `安全管理のために講じた措置`,
      subtitle:
        `当社が、お客様から取得した情報に関して安全管理のために講じた措置につきましては、末尾記載のお問い合わせ先にご連絡をいただきましたら、法令の定めに従い個別にご回答させていただきます。`,
      contents:
        []
    },
    {
      title:
        `第三者提供`,
      subtitle:
        `当社は、お客様から取得する情報のうち、個人データ（個人情報保護法第１６条第３項）に該当するものついては、あらかじめお客様の同意を得ずに、第三者（日本国外にある者を含みます。）に提供しません。
        但し、次の場合は除きます。`,
      contents:
        [
          `個人データの取扱いを外部に委託する場合`,
          `当社や当社サービスが買収された場合`,
          `事業パートナーと共同利用する場合（具体的な共同利用がある場合は、その内容を別途公表します。）`,
          `その他、法律によって合法的に第三者提供が許されている場合`,
        ]
    },
    {
      title:
        `アクセス解析ツール`,
      subtitle:
        `当社は、お客様のアクセス解析のために、「Googleアナリティクス」を利用しています。Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。Cookieを無効にすれば、これらの情報の収集を拒否することができます。詳しくはお使いのブラウザの設定をご確認ください。Googleアナリティクスについて、詳しくは以下からご確認ください。
        https://marketingplatform.google.com/about/analytics/terms/jp/`,
      contents:
        [],
    },
    {
      title:
        `プライバシーポリシーの変更`,
      subtitle:
        `当社は、必要に応じて、このプライバシーポリシーの内容を変更します。この場合、変更後のプライバシーポリシーの施行時期と内容を適切な方法により周知または通知します。`,
      contents:
        []
    },
    {
      title:
        `お問い合わせ`,
      subtitle:
        `お客様の情報の開示、情報の訂正、利用停止、削除をご希望の場合は、以下のメールアドレスにご連絡ください。
        e-mail
        zio.tt.dev@gmail.com
        この場合、必ず、運転免許証のご提示等当社が指定する方法により、ご本人からのご請求であることの確認をさせていただきます。なお、情報の開示請求については、開示の有無に関わらず、ご申請時に一件あたり1,000円の事務手数料を申し受けます。`,
      contents:
        []
    },
    {
      title:
      `2023年11月12日 制定`,
      subtitle:
      ``,
      contents:
      []
    }
  ]

  return (
    <div className='flex items-start justify-center w-screen min-h-screen overscroll-none'>
      <div className='flex flex-col items-center justify-center w-[80vw] h-[90vh] mt-[5vh]'>
        <div className='h-full w-full bg-gray-200/30 backdrop-blur-lg rounded-md border border-gray-200/30 shadow-lg flex flex-col justify-start py-[1vh] px-[3vw] overflow-auto'>
          <div className='flex text-left text-gray-500 text-lg md:text-2xl lg:text-4xl underline mb-[3vh]'>
            <h1>プライバシーポリシー</h1>
          </div>
          <div className='flex flex-col text-left text-gray-500'>
            {sections.map((section, index) => (
              <Contents
                key={index}
                title={section.title}
                subtitle={section.subtitle}
                contents={section.contents}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}