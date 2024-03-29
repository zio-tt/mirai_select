class Decision < ApplicationRecord
  has_many :conversations, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :decision_tags, dependent: :destroy
  has_many :tags, through: :decision_tags
  has_many :decision_characters, dependent: :destroy

  belongs_to :user

  scope :public_decisions, -> { includes(:user => { characters: :avatar_attachment }, :conversations => [:character_responses]).where(public: true).order(created_at: :desc) }

  def system_message(character1, character2)
    message = "ユーザーから与えられた質問文に対して、#{character1.name}と#{character2.name}というキャラクターになりきって返答してください。
    回答はJSON形式で返してください。また、それぞれの回答は重複しないものとします。
    回答は具体的にお願いします。
    それぞれのキャラクターのプロフィールは以下の通りです。"
    message << "#{character1.name}:"
    message << "性格(MBTI): #{character1.mbti_type}," if character1.mbti_type
    message << "口調: #{character1.tone}," if character1.tone
    message << "一人称: #{character1.first_person}," if character1.first_person
    message << "二人称: #{character1.second_person}," if character1.second_person
    message << "感情表現: #{character1.expression}," if character1.expression
    message << "価値観: #{character1.values}," if character1.values
    message << "共感性: #{character1.empathy}" if character1.empathy
    message << "#{character2.name}:"
    message << "性格(MBTI): #{character2.mbti_type}," if character2.mbti_type
    message << "口調: #{character2.tone}," if character2.tone
    message << "一人称: #{character2.first_person}," if character2.first_person
    message << "二人称: #{character2.second_person}," if character2.second_person
    message << "感情表現: #{character2.expression}," if character2.expression
    message << "価値観: #{character2.values}," if character2.values
    message << "共感性: #{character2.empathy}" if character2.empathy

    return message
  end

  def second_system_message(character1, character2)
    message="「ユーザーから与えられた質問文に対して、#{character1.name}と#{character2.name}というキャラクターになりきって返答してください。」というやりとりに対して、
    前回ユーザーが質問した質問文、選択した回答、回答について深掘りしたい内容を提示するので、再度キャラクターになりきって回答してください。
    回答はJSON形式で返してください。また、それぞれの回答は重複しないものとします。
    回答は具体的にお願いします。
    それぞれのキャラクターのプロフィールは以下の通りです。"
    message << "#{character1.name}:"
    message << "性格(MBTI): #{character1.mbti_type}," if character1.mbti_type
    message << "口調: #{character1.tone}," if character1.tone
    message << "一人称: #{character1.first_person}," if character1.first_person
    message << "二人称: #{character1.second_person}," if character1.second_person
    message << "感情表現: #{character1.expression}," if character1.expression
    message << "価値観: #{character1.values}," if character1.values
    message << "共感性: #{character1.empathy}" if character1.empathy
    message << "#{character2.name}:"
    message << "性格(MBTI): #{character2.mbti_type}," if character2.mbti_type
    message << "口調: #{character2.tone}," if character2.tone
    message << "一人称: #{character2.first_person}," if character2.first_person
    message << "二人称: #{character2.second_person}," if character2.second_person
    message << "感情表現: #{character2.expression}," if character2.expression
    message << "価値観: #{character2.values}," if character2.values
    message << "共感性: #{character2.empathy}" if character2.empathy

    return message
  end

  def second_message(query_text, before_query_text, user_decision)
    message="前回の質問文: #{before_query_text}, 前回の回答: #{user_decision}, 今回の質問文: #{query_text}"
  end

  def assistant_message(character1, character2)
    message = "
      - 回答はJSON形式で以下の様な形でお願いします。
        ```json
        {
          character1: {
            character1_name: { #{character1.name} }
            character1_response: { }
          }
          character2: {
            character2_name: { #{character2.name} }
            character2_response: { }
          }
        }
        ```

      - それぞれのresponseは100文字程度でお願いします。
    "

    return message
  end
end
