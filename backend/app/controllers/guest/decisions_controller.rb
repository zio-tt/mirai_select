class Guest::DecisionsController < ApplicationController
  include ErrorHandler
  include Rails.application.routes.url_helpers
  include Authentication
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:index]

  def index
    render json: { decisions: Decision.public_decisions }
  end
end
