class Users::OmniauthCallbacksController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :google_oauth2
  
  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
        flash[:notice] = I18n.t 'devise.omniauth_callbacks.success', kind: 'Google'
        sign_in_and_redirect @user, event: :authentication
    else
      session["devise.google_data"] = request.env["omniauth.auth"].except("extra")
      redirect_to new_user_registration_url, alert: @user.errors.full_messages.join("\n")
    end
  end

  def failure
    redirect_to "http://localhost:3001/auth/signin?alert=#{CGI.escape('Authentication failed, please try again.')}"
  end
end
