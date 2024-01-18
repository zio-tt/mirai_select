class Api::CharactersController < ApplicationController
  def index
    characters = Character.select_attribute.map do |character|
      avatar_url = character.avatar.attached? ? url_for(character.avatar) : nil
      character.attributes.merge(avatar: avatar_url)
    end

    render json: { characters: characters }
  end
end
