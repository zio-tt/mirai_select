class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Authentication
  rescue_from Pundit::NotAuthorizedError, with: :render_403
  before_action :check_xhr_header
  before_action :current_user

  def check_xhr_header
    return if request.xhr?
    render json: { error: 'forbidden' }, status: :forbidden
  end

  def render_403
    render status: 403, json: { message: "You don't have permission." }
  end
end
