# Strapi Web3 authentication plugin

This plugin allows users to create their account using their web3 provider (ex. metamask).

## Installation
1) Install `users-permissions` plugin.
2) Copy `webthree-auth` folder inside the `src/plugins` directory of a Strapi project.
3) Extends `user` schema of `users-permissions` plugin with to string fields : `token` and `address`
   1) Using Admin panel : in `Content-Type Builder`, add 2 string fields in the `User` `collection type`, name it `token` and `address`.
      Token field should be private.
   2) Using plugin extension file (copy schema from original `users-permissions` file if needed) :
   ```json
    // src/extensions/users-permissions/content-types/user/schema.json
    {
    // ...
    
    "attributes": {
    // ...
    
        "token": {
          "type": "string",
          "private": true
        },
        "address": {
          "type": "string"
        }
        
        // ...
    },
    
    // ...
    }
    ```

## Usage :

### Generate a new token :
`http://127.0.0.1:1337/webthree-auth/token/:address`
> Address is the 0x address provided by the web3 client (metamask) 

#### Example :
Request :
```
http://127.0.0.1:1337/webthree-auth/token/0x123456789123456789123456789123456789A06F
```

Result :
```
{
	"token": "9ec1012a-53e6c5f9-b2b440a9-5d7ea75a"
}
```

### Authenticate and get the jwt token :
`http://127.0.0.1:1337/webthree-auth/authenticate/:address/:signature`
> Address is the 0x address provided by the web3 client (metamask)

> Signature is a string obtained when user sign a message with his web3 client (metamask)
> Message should contain signature and default message is `'Your authentication token : ' + token`

#### Example :
Request :
```
http://127.0.0.1:1337/webthree-auth/authenticate/0x123456789123456789123456789123456789A06F/0xa1fa12355b1bb0094c2b1234d77e4aa684b6332e712349edf1ea1b99878d8f682e27a4e89ea67cd8db1fc6ac32ae11125ecffbd8925dc546343cfe0542c9a43a1c
```
