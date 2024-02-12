class Guest::UsersController < ApplicationController
  include Authentication
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:index]

  def index
    render json: { users: User.select_attributes }
  end
end
