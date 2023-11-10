Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins Rails.configuration.allow_origins

    resource '*',
      headers: :any,
      methods: [:get, :post, :patch, :put, :delete, :options, :head]
  end
end