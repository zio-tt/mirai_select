admin = {
    uid:      '5ad1a807e9796c03ec196'
    provider: 'google',
    name:     'Admin',
    email:    'Admin@example.com',
    image: File.open("app/images/item-#{i+1}-#{j+1}.jpg")
}

User.create(admin)