# Node Authentication API

API for registering users with mongodb and authentication using a JWT .

### Version
1.0.0

## Usage

```bash
npm install
```

```bash
npm start
```

##Endpoints
```bash
POST /users/register
```

```bash
POST /users/authenticate   // Gives back a token
```

```bash
GET /users/profile         // Needs json web token to authorize
```
