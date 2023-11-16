class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Authentication
  before_action :check_xhr_header
  before_action :current_user

  def check_xhr_header
    return if request.xhr?
    render json: { error: 'forbidden' }, status: :forbidden
  end
end
