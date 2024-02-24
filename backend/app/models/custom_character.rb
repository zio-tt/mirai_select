class CustomCharacter < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :character

  enum role: { user: 0, admin: 1 }

  validate :user_id_presence_based_on_role

  private

  def user_id_presence_based_on_role
    # roleがuserの場合、user_idが必須
    if user? && user_id.blank?
      errors.add(:user_id, "can't be blank for user role")
    end
  end
end
