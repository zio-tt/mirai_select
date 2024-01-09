class DecisionsController < ApplicationController
  include ErrorHandler
  before_action :set_key, :set_characters, only: [:callback]

  def index
    @decisions = Decision.where(public: true).order(created_at: :asc)
    @decisions = @decisions.map do |decision|
      user = decision.user
      query_text = decision.conversations.first.query_text
      decision.attributes.merge(
        user: user,
        characters: user.characters,
        first_query: query_text,
        conversations: decision.conversations.sort,
        character_responses: decision.conversations.map{|conversation| conversation.character_responses},
        tags: decision.tags,
        comments: decision.comments,
        bookmarks: decision.bookmarks
      )
    end
    render json: { decisions: @decisions }
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

  private

  def set_key
    @api_key = ENV["OPENAI_ACCESS_TOKEN"]
  end

  def set_characters
    @character1 = current_user.user_characters.find_by(role: :character1).character
    @character2 = current_user.user_characters.find_by(role: :character2).character
  end
end
