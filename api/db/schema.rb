# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_11_04_015640) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "character_responses", force: :cascade do |t|
    t.bigint "decision_conversation_id", null: false
    t.bigint "character_id", null: false
    t.text "response"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_character_responses_on_character_id"
    t.index ["decision_conversation_id"], name: "index_character_responses_on_decision_conversation_id"
  end

  create_table "characters", force: :cascade do |t|
    t.string "name"
    t.string "image_url"
    t.integer "personality"
    t.integer "speaking_style"
    t.integer "values"
    t.integer "optimism"
    t.integer "humor"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "decision_id", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["decision_id"], name: "index_comments_on_decision_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "decision_conversations", force: :cascade do |t|
    t.bigint "decision_id", null: false
    t.integer "user_decision"
    t.text "query_text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["decision_id"], name: "index_decision_conversations_on_decision_id"
  end

  create_table "decisions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.boolean "public", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_decisions_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "templates", force: :cascade do |t|
    t.string "name"
    t.text "query_text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_characters", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "character_id", null: false
    t.integer "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_user_characters_on_character_id"
    t.index ["user_id"], name: "index_user_characters_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", default: "名無し", null: false
    t.string "provider", null: false
    t.string "uid", null: false
    t.integer "tokens", default: 1000, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true
  end

  add_foreign_key "character_responses", "characters"
  add_foreign_key "character_responses", "decision_conversations"
  add_foreign_key "comments", "decisions"
  add_foreign_key "comments", "users"
  add_foreign_key "decision_conversations", "decisions"
  add_foreign_key "decisions", "users"
  add_foreign_key "user_characters", "characters"
  add_foreign_key "user_characters", "users"
end
