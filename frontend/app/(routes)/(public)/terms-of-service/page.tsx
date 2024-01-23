export default function TermOfService() {
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

  // 利用規約の各セクションのデータ
  const sections = [
    {
      title:
        `本規約への同意`,
      subtitle:
        `ユーザーは、本サービスを利用することによって、本規約に有効かつ取り消し不能な同意をしたものとみなされます。本規約に同意しないユーザーは、本サービスをご利用いただけません。`,
      contents:
        []
    },
    {
      title:
        `利用登録`,
      subtitle:
        `本サービスの利用を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、本サービスの利用登録をすることができます。`,
      contents:
        []
    },
    {
      title:
        `登録拒否`,
      subtitle:
        `当社は、以下のいずれかの事由があると判断した場合、利用登録の申請を承認しないことがあります。当社は登録拒否の理由について一切の開示義務を負いません。`,
      contents:
        [
          `虚偽の事項を届け出た場合`,
          `本規約に違反したことがある者からの申請である場合`,
          `その他、当社が利用登録を相当でないと判断した場合`
        ]
    },
    {
      title:
        `未成年による利用`,
      subtitle:
        `ユーザーが未成年である場合には、法定代理人の同意を得た上で、本サービスを利用してください。本サービスのご利用にあたり必要となるスマートフォンその他デバイスについても、必ず法定代理人の同意を得た上でご使用下さい。
        法定代理人の同意を得ずに本サービスのご利用を開始したユーザーが成年に達した場合、未成年者であった間の利用行為を追認したものとみなします。`,
      contents:
        []
    },
    {
      title:
        `ログイン情報の管理`,
      subtitle:
        `ユーザーは、自己の責任において、本サービスのログイン情報を適切に管理するものとします。ユーザーは、いかなる場合にも、ログイン情報を第三者に譲渡または貸与し、もしくは第三者と共用することはできません。当社は、ログイン情報が第三者によって使用されたことによって生じた損害につき、当社に故意又は重大な過失がある場合を除き、一切の責任を負いません。`,
      contents:
        []
    },
    {
      title:
        `コンテンツのご利用`,
      subtitle:
        `当社は、ユーザーに対し、本サービスが提供する文章、画像、動画、音声、音楽、ソフトウェア、プログラム、コードその他のコンテンツについて、本サービスの利用範囲内における私的な利用を許諾します。有償コンテンツについては、当社が定める利用料金の支払が完了した場合に、本サービスの利用範囲内における私的な利用を許諾します。これは、譲渡及び再許諾できない、非独占的な利用権です。この範囲を超えて本サービスが提供するコンテンツを利用することは一切禁止します。
        理由の如何を問わず、ユーザーが本サービスを利用する権利を失った場合、本サービスの一切のコンテンツの利用ができなくなることを、ユーザーは予め承諾するものとします。`,
      contents:
        []
    },
    {
      title:
        `遅延損害金`,
      subtitle:
        `当社に対する金銭債務の支払を遅滞したユーザーは、当社に対し、年14.6％の割合による遅延損害金を支払うものとします。`,
      contents:
        []
    },
    {
      title:
        `ユーザーの投稿`,
      subtitle:
        `ユーザーは、ユーザーの投稿に含まれる情報を送信することについて適法な権利を有していること、及びユーザーの投稿が第三者の知的財産権（著作権、特許権、実用新案権、商標権、意匠権（それらの権利を取得し、又はそれらの権利につき登録等を出願する権利を含みます。）又はアイデア、ノウハウ等をいい、以下同様とします。）、所有権その他の権利を侵害していないことについて、当社に対し表明し、保証するものとします。
        ユーザーの投稿に関する著作権は、ユーザー自身に留保されます。当社はユーザーの投稿に関して著作権を取得することはありません。ただし、当社は、本サービスの提供、維持、改善又は本サービスのプロモーションに必要な範囲において、無償、無期限かつ地域非限定で、ユーザーの投稿を複製、翻案、自動公衆送信及びそのために必要な送信可能化をすることができるものとします。この場合、ユーザーは、当社および当社から権利を承継し又は許諾されたものに対し著作者人格権を行使しないものとします。
        ユーザーは自己の責任において投稿のバックアップを行わなければなりません。当社は、ユーザーの投稿のバックアップを行う義務を負わないものとします。
        ユーザーは、以下のいずれかに該当する情報を投稿してはいけません。`,
      contents:
        [
          `当社又は第三者の知的財産権、肖像権、プライバシー、名誉、その他の権利又は利益を侵害する情報`,
          `ユーザーを特定可能な個人情報等を含む情報(ただし、利用登録に必要な場合等当社が求めた場合、その他当社が認めた場合を除きます。)`,
          `わいせつな表現を含む情報`,
          `異性、同性を問わず、面識のない第三者との出会い又はわいせつな行為等を目的とする情報 `,
          `自殺、自傷行為を誘引、勧誘又は助長する表現を含む情報`,
          `薬物·危険ドラッグの売買に関する情報又は薬物危険ドラッグの不適切な利用を助長する表現を含む情報`,
          `宗教的行為、宗教団体、政治的活動、政治団体の宣伝又は広告に関する情報`,
          `ネットワークビジネス関連の勧誘等に関する情報`,
          `ジャンクメール、スパムメールに相当する文面を含む情報`,
          `未成年者に悪影響を及ぼすおそれのある情報`,
          `残虐な表現その他他人に不快感を与えるおそれのある情報`,
          `コンピュータウイルス等の不正プログラムを含む情報`,
          `その他当社が不適切と判断する情報`,
        ]
    },
    {
      title:
        `禁止事項`,
      subtitle:
        `ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。`,
      contents:
        [
          `法令、裁判所の判決、決定若しくは命令、又は法令上拘束力のある行政措置に違反する行為又はこれらを助長する行為`,
          `犯罪行為に関連する行為`,
          `当社や第三者の知的財産権を侵害する行為`,
          `当社や第三者の肖像権、プライバシー、名誉、その他の権利又は利益を侵害する行為 `,
          `当社や第三者のサーバーまたはネットワークに過度の負担をかけたり、その正常な作動を妨害する行為`,
          `当社のサービスの運営を妨害するおそれのある行為`,
          `不正アクセスをし、またはこれを試みる行為`,
          `逆アセンブル、逆コンパイル、リバースエンジニアリング等によって本サービスのソースコードを解析する行為`,
          `本サービスに接続しているシステムに権限なく不正にアクセスし又は当社設備に蓄積された情報を不正に書き換え若しくは消去する行為`,
          `本サービスのウェブサイトやソフトウェアを複製、送信、譲渡、貸与又は改変する行為`,
          `本サービス上のアカウント又はコンテンツを第三者に有償で貸与、譲渡、売買等をする行為`,
          `本サービスによって得られた情報を商業的に利用する行為`,
          `当社が意図しない方法によって本サービスに関連して利益を得ることを目的とする行為`,
          `当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為`,
          `他のユーザーに関する個人情報等を収集または蓄積する行為`,
          `違法、不正又は不当な目的を持って本サービスを利用する行為`,
          `本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為`,
          `他のユーザーに成りすます行為`,
          `他のユーザーのアカウントを利用する行為`,
          `面識のない異性との出会いを目的とした行為`,
          `反社会的勢力に対して直接または間接に利益を供与する行為`,
          `公序良俗に違反する行為`,
          `歩行中、車両運転中、その他本サービスの利用が不適切な状況又は態様において本サービスを利用する行為`,
          `その他、当社が不適切と判断する行為`,
        ]
    },
    {
      title:
        `換金行為の禁止`,
      subtitle:
        `本サービス内で取得した一切のコンテンツまたは本仮想通貨については、手段の如何を問わず、以下の取引を一切禁止します。`,
      contents:
        [
          `売買`,
          `金銭その他の対価を授受する形でのあらゆる譲渡、譲受、貸与、借用等`,
          `その他換金行為に該当すると当社が判断する一切の行為`,
        ]
    },
    {
      title:
        `反社会的勢力の排除`,
      subtitle:
        `ユーザーは、次の各号のいずれか一にも該当しないことを表明し、かつ将来にわたっても該当しないことを表明し、保証するものとします。`,
      contents:
        [
          `自ら（法人その他の団体にあっては、自らの役員を含みます。）が、暴力団、暴力団員、暴力団員でなくなった時から5年を経過しない者、暴力団準構成員、暴力団関係企業、総会屋、社会運動等標ぼうゴロまたは特殊知能暴力集団等その他これらに準じる者（以下総称して「暴力団員等」といいます。）であること`,
          `ユーザーが法人その他の団体の場合にあっては、暴力団員等が経営を支配していると認められる関係を有すること`,
          `ユーザーが法人その他の団体の場合にあっては、暴力団員等が経営に実質的に関与していると認められる関係を有すること`,
          `自らもしくは第三者の不正の利益を図る目的または第三者に損害を加える目的をもって取引を行うなど、暴力団員等を利用していると認められる関係を有すること`,
          `暴力団員等に対して資金等を提供し、または便宜を供与するなどの関与をしていると認められる関係を有すること`,
          `ユーザーが法人その他の団体の場合にあっては、自らの役員または自らの経営に実質的に関与している者が暴力団員等と社会的に非難されるべき関係を有すること`,
        ]
    },
    {
      title:
        ``,
      subtitle:
        `ユーザーは、自らまたは第三者を利用して次の各号のいずれか一にでも該当する行為を行わないことを保証するものとします。`,
      contents:
        [
          `暴力的な要求行為`,
          `法的な責任を超えた不当な要求行為`,
          `取引に関して、脅迫的な言動をし、または暴力を用いる行為`,
          `風説を流布し、偽計を用い、または威力を用いて、当社の信用を毀損し、または当社の業務を妨害する行為`,
          `その他前各号に準ずる行為`,
        ]
    },
    {
      title:
        `利用制限`,
      subtitle:
        `当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。当社は、本条に基づき当社が行った行為によりユーザーに生じた損害について、一切の責任を負いません。`,
      contents:
        [
          `本規約のいずれかの条項に違反した場合`,
          `登録事項に虚偽の事実があることが判明した場合`,
          `金銭債務の不履行があった場合`,
          `当社からの連絡に対し、相当の期間が経過しても返答がない場合`,
          `最終のご利用日から相当期間、本サービスのご利用がない場合`,
          `反社会的勢力等であるか、反社会的勢力等との何らかの交流若しくは関与を行っていると当社が判断した場合`,
          `その他、当社が本サービスの利用を適当でないと判断した場合`,
        ]
    },
    {
      title:
        `本サービスの提供の停止`,
      subtitle:
        `当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。当社は、この場合にユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。`,
      contents:
        [
          `本サービスにかかるコンピュータシステムの保守点検または更新を行う場合`,
          `地震、落雷、火災、停電、天災またはウィルスの蔓延などの不可抗力により、本サービスの提供が困難となった場合`,
          `コンピュータまたは通信回線等が事故により停止した場合`,
          `その他、当社が本サービスの提供が困難と判断した場合`,
        ]
    },
    {
      title:
        `退会`,
      subtitle:
        `ユーザーは、当社の定める手続により、利用登録を抹消し、本サービスから退会できるものとします。`,
      contents:
        []
    },
    {
      title:
        `保証の否認`,
      subtitle:
        `当社は、本サービスや本サービスが提供するコンテンツに、システムバグや第三者の権利侵害が含まれないことを保証するものではありません。また、安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性を保証するものでもありません。`,
      contents:
        []
    },
    {
      title:
        `免責`,
      subtitle:
        `当社は、本サービスに関してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
        消費者契約に該当する場合であっても、当社は、当社の過失（重過失を除きます。）によってユーザーに生じた損害のうち、ユーザーに直接かつ現実に発生した損害についてのみ賠償責任を負うものとし、また、その賠償額は、本サービスの利用料金の直近1ヶ月分または金1万円のいずれか低い方を上限とします。`,
      contents:
        []
    },
    {
      title:
        `サービス内容の変更`,
      subtitle:
        `当社は、ユーザーに通知することなく、本サービスの内容を変更したり、本サービスの提供を中止、終了することができるものとします。ユーザーは、本サービスが終了した場合、有料コンテンツを利用する一切の権利を失い、以後、当該有料コンテンツを利用できなくなることについて、あらかじめ、異議なく同意するものとします。当社は、これらによってユーザーに生じた損害について一切の責任を負いません。`,
      contents:
        []
    },
    {
      title:
        `利用規約の変更`,
      subtitle:
        `当社は、ユーザーに通知することなく、いつでも本規約を変更することができるものとします。変更後の本規約は、当社ウェブサイトに掲示された時点から効力を生じるものとします。本規約の変更後、本サービスの利用を継続したユーザーは、変更後の本規約に同意したものとみなします。`,
      contents:
        []
    },
    {
      title:
        `個人情報の取扱い`,
      subtitle:
        `本サービスの利用によって取得するユーザーの個人情報については、当社のプライバシーポリシーに従い適切に取り扱うものとします。`,
      contents:
        []
    },
    {
      title:
        `通知または連絡`,
      subtitle:
        `ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。`,
      contents:
        []
    },
    {
      title:
        `権利義務の譲渡`,
      subtitle:
        `ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。`,
      contents:
        []
    },
    {
      title:
        `事業譲渡`,
      subtitle:
        `当社は本サービスにかかる事業を他社に事業譲渡（事業譲渡、会社分割その他事業が移転するあらゆる場合を含みます。）した場合には、当該事業譲渡に伴い利用契約上の地位、本規約に基づく権利及び義務並びにユーザーの情報を当該事業譲渡の譲受人に譲渡することができるものとします。ユーザーは、かかる譲渡につき予め同意したものとみなします。`,
      contents:
        []
    },
    {
      title:
        `適用関係`,
      subtitle:
        `本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。
        当社は本サービスに関し、本規約のほか、ご利用にあたってのルールを定めることがあります。これらのルールは、その名称のいかんに関わらず、本規約の一部を構成するものとします。本規約がこれらのルールと矛盾する場合には、これらのルールが優先して適用されるものとします。`,
      contents:
        []
    },
    {
      title:
        `分離可能性`,
      subtitle:
        `本規約のいずれかの条項又はその一部が無効又は執行不能と判断された場合であっても、当該判断は他の部分に影響を及ぼさず、本規約の残りの部分は、引き続き有効かつ執行力を有するものとします。`,
      contents:
        []
    },
    {
      title:
        `準拠法・裁判管轄`,
      subtitle:
        `本規約の解釈にあたっては、日本法を準拠法とします。
        本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する地方裁判所を専属的合意管轄とします。`,
      contents:
        []
    },
  ]

  return (
    <div className='flex items-start justify-center w-screen min-h-screen overscroll-none'>
      <div className='flex flex-col items-center justify-center w-[80vw] h-[90vh] mt-[5vh]'>
        <div className='h-full w-full bg-gray-200/30 backdrop-blur-lg rounded-md border border-gray-200/30 shadow-lg flex flex-col justify-start py-[1vh] px-[3vw] overflow-auto'>
          <div className='flex text-left text-gray-500 text-lg md:text-2xl lg:text-4xl underline mb-[3vh]'>
            <h1>利用規約</h1>
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
          <p className='flex flex-col text-left text-gray-500 text-xs md:text-sm lg:text-lg'>2023年11月12日 制定</p>
        </div>
      </div>
    </div>
  );
}