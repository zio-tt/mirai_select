class Api::TagsController < ApplicationController
  def index
    render json: { tags: Tag.all }
  end

  def create
    tags.each do |tag|
      Tag.create(name: tag)
    end

    render json: { message: 'Success to create tags' }
  end

  private

  def tags_params
    params.require(:tags)
  end
end
