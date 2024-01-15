class DecisionsController < ApplicationController
  include ErrorHandler
  include Rails.application.routes.url_helpers
  before_action :set_key, :set_characters, only: [:callback]

  def index
    @users = User.all.select(:id, :name, :avatar)
    @current_user = {
      id:     current_user.id,
      name:   current_user.name,
      token:  current_user.token,
      avatar: current_user.avatar
    }

    # decisions_conditionパラメータに基づいて決定をフィルタリング
    if decisions_condition == "public"
      @decisions = Decision.public_decisions
    elsif decisions_condition == "private"
      @decisions = current_user.decisions
    elsif decisions_condition == "bookmarked"
      @decisions = current_user.bookmarked_decisions.includes(:comments, :bookmarks).order(created_at: :desc)
    end

    if @decisions.nil?
      render json: { 
        error: "Decisions could not be found.",
        current_user: @current_user,
        users:        @users,
        decisions:    [],
        tags:         [],
        comments:     [],
        bookmarks:    []
      }, status: :ok and return
    end
  
    @decisions = @decisions.map do |decision|
      characters = decision.user.characters.map do |character|
        avatar_url = character.avatar.attached? ? url_for(character.avatar) : nil
        character.attributes.merge(avatar: avatar_url)
      end
  
      conversations = decision.conversations.map do |conversation|
        character_responses = conversation.character_responses
        conversation.attributes.merge(character_responses: character_responses)
      end
      
      decision.attributes.merge(
        conversations: conversations,
        characters:    characters,
        decision_tags: decision.decision_tags.map(&:tag_id),
        comments:      decision.comments,
        bookmarks:     decision.bookmarks
      )
    end

    decision_ids  = @decisions.map { |decision| decision["id"] }
    decision_tags = DecisionTag.where(decision_id: decision_ids)
    @tags         = Tag.where(id: decision_tags.pluck(:tag_id))
    @comments     = Comment.where(decision_id: decision_ids)
    @bookmarks    = Bookmark.where(decision_id: decision_ids)


    render json: { current_user: @current_user,
                   users:        @users,
                   decisions:    @decisions,
                   tags:         @tags,
                   comments:     @comments,
                   bookmarks:    @bookmarks
                 }
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

  def create
    ActiveRecord::Base.transaction do
      update_decision_and_conversation
      process_tags
    end

    render json: { message: "Decision was successfully created." }
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_key
    @api_key = ENV["OPENAI_ACCESS_TOKEN"]
  end

  def set_characters
    @character1 = current_user.user_characters.find_by(role: :character1).character
    @character2 = current_user.user_characters.find_by(role: :character2).character
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
    params.require(:fetchDecisionsCondition)
  end
end
