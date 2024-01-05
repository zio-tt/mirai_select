namespace :tokens do
  desc "Increase user tokens daily"
  task increase: :environment do
    User.find_each do |user|
      new_token_count = [user.token + 100, 300].min
      user.update(token: new_token_count)
    end
  end
end