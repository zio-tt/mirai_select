class Api::CharacterResponsesController < ApplicationController
  def index
    @character_responses = CharacterResponse.select_response
    render json: @character_responses
  end

  def create
    parsed_response_params.map do |character_response|
      @character_response = CharacterResponse.new(
        conversation_id: character_response["conversation_id"],
        character_id:    character_response["character_id"],
        response:        character_response["response"]
      )

      @character_response.save
    end

    render json: { character_responses: @character_response }
  end

  private

  def parsed_response_params
    params.require(:parsedResponse)
  end
end
