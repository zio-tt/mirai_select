class Guest::TagsController < ApplicationController
  include Authentication
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:index]
  
  def index
    render json: { tags: Tag.all }
  end
end
