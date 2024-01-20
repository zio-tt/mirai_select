class Api::DecisionsController < ApplicationController
  include ErrorHandler
  include Rails.application.routes.url_helpers
  before_action :set_key, :set_characters, only: [:callback]
  before_action :set_decision, only: [:update, :destroy]

  def index
    case decisions_condition
    when "public"
      @decisions = Decision.public_decisions
    when "private"
      @decisions = current_user.decisions
    when "favorite"
      @decisions = current_user.bookmarked_decisions
    end

    render json: @decisions
  end

  def create
    @decision = Decision.new(
      user_id:    current_user.id,
      public:     false
    )
    @decision.save!

    render json: { decision: @decision }
  end

  def callback
    input_text = params[:inputText]
    @decision = Decision.new(user_id: current_user.id, public: false)

    if @decision.save
      response = OpenAiService.new(@api_key, @decision, @character1, @character2).call(input_text)
      render json: { response: response }
    else
      render json: { error: "Decision could not be saved." }, status: :unprocessable_entity
    end
  end

  def destroy
    @decision.destroy!
    render json: { decisions: Decision.all }
  end

  def update
    @decision.update!(public: is_public_param)
    render json: { decision: @decision }
  end

  private

  def set_key
    @api_key = ENV["OPENAI_ACCESS_TOKEN"]
  end

  def set_characters
    @character1 = current_user.user_characters.find_by(role: :character1).character
    @character2 = current_user.user_characters.find_by(role: :character2).character
  end

  def set_decision
    @decision = Decision.find(params[:id])
  end

  def update_decision_and_conversation
    decision = Decision.find(decision_params["id"])
    conversation = Conversation.find(conversation_params["id"])

    decision.update!(public: is_public_param)
    conversation.update!(user_decision: user_decision_param)
  end

  def process_tags
    tags_param.each do |tag|
      tag_record = Tag.find_or_create_by!(name: tag)
      DecisionTag.create!(decision_id: decision_params["id"], tag_id: tag_record.id)
    end
  end

  # パラメーターの取得メソッド
  def query_text_param
    params.require(:queryText)
  end

  def decision_params
    params.require(:decision).permit(:id)
  end

  def conversation_params
    params.require(:conversation).permit(:id)
  end

  def user_decision_param
    params.require(:userDecision)
  end

  def is_public_param
    params.require(:isPublic)
  end

  def tags_param
    params.require(:tags)
  end

  def decisions_condition
    params.require(:condition)
  end
end
