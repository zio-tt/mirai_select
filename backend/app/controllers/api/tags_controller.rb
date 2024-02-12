class Api::TagsController < ApplicationController
  def index
    render json: { tags: Tag.all }
  end

  def create
    tags_params.each do |tag|
      Tag.create(name: tag)
    end

    render json: { tags: Tag.all }
  end

  private

  def tags_params
    params.require(:tags)
  end
end
