class Guest::CommentsController < ApplicationController
  include Authentication
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:index]

  def index
    render json: { comments: Comment.all }
  end
end
