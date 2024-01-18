class Api::TagsController < ApplicationController
  def index
    render json: { tags: Tag.all }
  end

  def create
    Tag.find_or_create_by(name: tags_params)
    render json: { message: 'Success to create tag' }
  end

  private

  def tags_params
    params.require(:tags)
  end
end
