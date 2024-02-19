class Character < ApplicationRecord
  has_many :character_responses, dependent: :destroy
  has_many :user_characters, dependent: :destroy
  has_many :custom_characters, dependent: :destroy
  has_many :decision_characters, dependent: :destroy
  has_one_attached :avatar

  scope :select_attribute, -> { select(:id, :name, :character1_welcome, :character2_welcome) }

  # 性格(MBTI)
  enum mbti_type: {
    ISTJ: 0,  # 管理者：実用的で事実に基づいた思考の持ち主。その信頼性は紛れもなく本物。
    ISFJ: 1,  # 擁護者：非常に献身的で心の温かい擁護者。いつでも大切な人を守る準備ができている。
    INFJ: 2,  # 提唱者：物静かで神秘的だが、人々を非常に勇気づける飽くなき理想主義者
    INTJ: 3,  # 建築家：想像力が豊かで、戦略的な思考の持ち主。あらゆる物事に対して計画を立てる。
    ISTP: 4,  # 巨匠：大胆で実践的な思考を持つ実験者。あらゆる道具を使いこなす。
    ISFP: 5,  # 冒険家：柔軟性と魅力がある芸術家。常に進んで物事を探索し経験しようとする。
    INFP: 6,  # 仲介者：詩人肌で親切な利他主義者。良い物事のためなら、いつでも懸命に手を差し伸べる。
    INTP: 7,  # 論理学者：貪欲な知識欲を持つ革新的な発明家
    ESTP: 8,  # 起業家：賢くてエネルギッシュで、非常に鋭い知覚の持ち主。危険と隣り合わせの人生を心から楽しむ。
    ESFP: 9,  # エンターテイナー：自発性がありエネルギッシュで熱心なエンターテイナー。周りが退屈することは決してない。
    ENFP: 10, # 運動家：情熱的で独創力があり、かつ社交的な自由人。常に笑いほほ笑みの種を見つけられる。
    ENTP: 11, # 討論者：賢くて好奇心旺盛な思考家。知的挑戦には必ず受けて立つ。
    ESTJ: 12, # 幹部：優秀な管理者で、物事や人々を管理する能力にかけては、右に出る者はいない。
    ESFJ: 13, # 領事：非常に思いやりがあり社交的で、人気がある。常に熱心に人々に手を差し伸べている。
    ENFJ: 14, # 主人公：カリスマ性があり、人々を励ますリーダー。聞く人を魅了する。
    ENTJ: 15  # 指揮官：大胆で想像力豊か、かつ強い意志を持つ指導者。常に道を見つけるか、道を切り開く。
  }

  # 口調
  enum tone: {
    polite:        0,   # 丁寧
    calm:          1,   # 落ち着いた
    casual:        2,   # カジュアル
    energetic:     3,   # 活発
    confident:     4,   # 自信がある
    logical:       5,   # 論理的
  }

  # 感情表現
  enum expression: {
    humorous:      0,   # ユーモア
    sarcastic:     1,   # 皮肉
    passionate:    2,   # 情熱的
    creative:      3,   # 創造的
    proactive:     4,   # 積極的
    passive:       5,   # 消極的
    emotional:     6,   # 感情的
    serious:       7,   # 真面目
    irresponsible: 8,   # 不真面目
    negative:      9,   # ネガティブ
    positive:      10,  # ポジティブ
    kind:          11,  # 優しい
    strict:        12,  # 厳しい
  }

  # 共感があるかどうか
  enum empathy:  { high: 0, moderate: 1, low: 2 }

  after_create :create_welcome_text

  def create_welcome_system_message(character)
    message = "#{character.name}の口調で説明文を2つ作成してください。
    内容は元コメントのまま口調だけキャラクターに変更してください。
    character1_welcomeの元コメント「相談内容を下記のフォームに50文字以内かつユーザーごとに所持しているポイント数以内で入力してください。」
    character2_welcomeの元コメント「ポイントは毎週月曜日に100ポイント付与されます（最大300ポイント）。」
    回答はJSON形式で返してください。
    キャラクターのプロフィールは以下の通りです。"
    message << "#{character.name}:"
    message << "口調: #{character.tone}," if character.tone
    message << "一人称: #{character.first_person}," if character.first_person
    message << "二人称: #{character.second_person}," if character.second_person

    return message
  end

  def create_welcome_assistant_message(character)
    message = "
      - 回答はJSON形式で以下の様な形でお願いします。
        ```json
        {
          response: {
            character_name: { #{character.name} }
            character1_welcome: { }
            character2_welcome: { }
          }
        }
        ```

      - それぞれのresponseは100文字程度でお願いします。
    "

    return message
  end

  private

  def create_welcome_text
    @api_key = ENV["OPENAI_ACCESS_TOKEN"]
    response = CharacterInit.new(@api_key, self).create_welcome_text
    if response
      self.character1_welcome = response[:character1_welcome]
      self.character2_welcome = response[:character2_welcome]
      self.save
    end
  end
end
