const users = [
    {
      "id": "3291280e-5400-490d-8865-49f6591c249c",
      "email": "harshalrawal@gmail.com",
      "phone": "123456789",
      "name": "Harshal",
      "username": "harshalrawal",
      "passwordHash": "password",
      "hashedPin": "$2b$10$yVP9PPjR7b8CnzYnRveoie6bjK1yn3CSOmMk3cX2jy62buPpFHqTO",
      "profilePicture": null,
      "walletId": "80f7b7c0-d495-430f-990d-49e3c5ddc160"
    },
    {
      "id": "57526355-c592-48ee-8ab0-76cdd7905729",
      "email": "test@gmail.com",
      "phone": "9303499211",
      "name": "test",
      "username": "test1234",
      "passwordHash": "12345678",
      "hashedPin": null,
      "profilePicture": null,
      "walletId": null
    },
    {
      "id": "64275ca0-3e19-4bfe-a50c-9a530767c9a0",
      "email": "kedar1234@gmail.com",
      "phone": "9876543210",
      "name": "kedar",
      "username": "kedar1234",
      "passwordHash": "hello",
      "hashedPin": null,
      "profilePicture": null,
      "walletId": "64275ca0-3e19-4bfe-a50c-9a530767c9a0"
    }
  ]
  
  console.log(JSON.stringify(users, null, 2))


  const wallets = [
    {
      "id": "0a5a7e5c-9e58-4cbc-83ba-43e786281a5b",
      "balance": 200,
      "userId": "57526355-c592-48ee-8ab0-76cdd7905729"
    },
    {
      "id": "61322557-52a1-472a-8a10-553fb9756222",
      "balance": 2807,
      "userId": "64275ca0-3e19-4bfe-a50c-9a530767c9a0"
    },
    {
      "id": "80f7b7c0-d495-430f-990d-49e3c5ddc160",
      "balance": 0,
      "userId": "3291280e-5400-490d-8865-49f6591c249c"
    }
  ]

console.log(JSON.stringify(wallets, null, 2))