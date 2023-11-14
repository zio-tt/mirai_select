require "test_helper"

class UserSessionsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get user_sessions_create_url
    assert_response :success
  end
end
