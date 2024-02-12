class AdminController < ApplicationController
  include Authentication
  before_action :authenticate_admin
  skip_before_action :authenticate_admin, only: [:dont_sreep]
  skip_before_action :check_xhr_header, only: [:dont_sreep]

  require 'openssl'
  require 'base64'

  def dont_sreep
    render json: { message: 'I am awake' }
  end
end
