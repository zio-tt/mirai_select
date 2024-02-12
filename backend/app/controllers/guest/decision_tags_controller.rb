class Guest::DecisionTagsController < ApplicationController
  include Authentication
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:index]

  def index
    render json: { decision_tags: DecisionTag.all }
  end
end
