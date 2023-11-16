module ErrorHandler
  extend ActiveSupport::Concern

  included do
    rescue_from StandardError, with: :handle_standard_error
    rescue_from JWT::DecodeError, with: :handle_jwt_decode_error
  end

  private

  def handle_standard_error(e)
    render json: { error: e.message }, status: :internal_server_error
  end

  def handle_jwt_decode_error(e)
    render json: { error: e.message }, status: :unauthorized
  end
end