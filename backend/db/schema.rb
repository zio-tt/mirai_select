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

ActiveRecord::Schema[7.0].define(version: 2023_12_21_143115) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "bookmarks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "decision_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["decision_id"], name: "index_bookmarks_on_decision_id"
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "character_responses", force: :cascade do |t|
    t.bigint "conversation_id", null: false
    t.bigint "character_id", null: false
    t.text "response"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_character_responses_on_character_id"
    t.index ["conversation_id"], name: "index_character_responses_on_conversation_id"
  end

  create_table "characters", force: :cascade do |t|
    t.string "name", default: "名無し", null: false
    t.integer "mbti_type", default: 0, null: false
    t.integer "tone", default: 0, null: false
    t.string "first_person", default: "私", null: false
    t.string "second_person", default: "あなた", null: false
    t.integer "expression", default: 0, null: false
    t.string "values"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "empathy", default: 0, null: false
    t.text "welcome_text", default: "", null: false
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

  create_table "conversations", force: :cascade do |t|
    t.bigint "decision_id", null: false
    t.integer "user_decision"
    t.text "query_text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["decision_id"], name: "index_conversations_on_decision_id"
  end

  create_table "decision_tags", force: :cascade do |t|
    t.bigint "decision_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["decision_id"], name: "index_decision_tags_on_decision_id"
    t.index ["tag_id"], name: "index_decision_tags_on_tag_id"
  end

  create_table "decisions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.boolean "public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_decisions_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "template_tags", force: :cascade do |t|
    t.bigint "template_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tag_id"], name: "index_template_tags_on_tag_id"
    t.index ["template_id"], name: "index_template_tags_on_template_id"
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
    t.string "uid", null: false
    t.string "provider", null: false
    t.string "name", default: "名無し", null: false
    t.string "email"
    t.string "avatar"
    t.integer "token", default: 1000, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "bookmarks", "decisions"
  add_foreign_key "bookmarks", "users"
  add_foreign_key "character_responses", "characters"
  add_foreign_key "character_responses", "conversations"
  add_foreign_key "comments", "decisions"
  add_foreign_key "comments", "users"
  add_foreign_key "conversations", "decisions"
  add_foreign_key "decision_tags", "decisions"
  add_foreign_key "decision_tags", "tags"
  add_foreign_key "decisions", "users"
  add_foreign_key "template_tags", "tags"
  add_foreign_key "template_tags", "templates"
  add_foreign_key "user_characters", "characters"
  add_foreign_key "user_characters", "users"
end
