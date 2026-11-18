# Blog API - REST API & Authentication

A complete RESTful API for a blog platform with JWT authentication, role-based access control, and CORS configuration, built with Express, Prisma, and Passport-JWT.

## Learning Objectives

This project was specifically designed to demonstrate and practice:

- **REST Architecture** - Understanding REST principles and constraints
- **API Endpoint Naming** - RESTful naming conventions
- **HTTP Methods/Verbs** - GET, POST, PUT, DELETE usage patterns
- **Same Origin Policy** - Browser security mechanism
- **CORS** - Cross-Origin Resource Sharing
- **CORS Headers** - Access-Control - headers explained
- **Token Authentication** - JWT vs Session-based auth
- **JSON Web Tokens** - Structure, signing, verification
- **Authorization Headers** - Bearer token format
- **Token Expiration** - Security through limited lifetimes

## Live Demo

[View Live Demo](https://leandroesposito.github.io/top-blog-api-clients/)
\*The free servers may take a few seconds to respond on first request.

## Screenshots

![Login](https://github.com/leandroesposito/top-blog-api/blob/main/screenshots/1_login.png)
![Error](https://github.com/leandroesposito/top-blog-api/blob/main/screenshots/2_error.png)
![New Post](https://github.com/leandroesposito/top-blog-api/blob/main/screenshots/3_new_post.png)
![Post](https://github.com/leandroesposito/top-blog-api/blob/main/screenshots/4_post.png)
![Comment](https://github.com/leandroesposito/top-blog-api/blob/main/screenshots/5_comment.png)

## What is REST?

**REST (Representational State Transfer)** is an architectural style for designing networked applications. It uses HTTP protocols and defines a set of constraints for creating scalable web services.

### REST Constraints

| Constraint            | Description                                            |
| --------------------- | ------------------------------------------------------ |
| **Client-Server**     | Separation of concerns between UI and data storage     |
| **Stateless**         | Each request contains all necessary information        |
| **Cacheable**         | Responses must define themselves as cacheable or not   |
| **Layered System**    | Client cannot tell if connected directly to end server |
| **Uniform Interface** | Consistent resource identification and manipulation    |

### Why Use REST for APIs?

- **Scalability** - Stateless nature allows horizontal scaling
- **Simplicity** - Uses standard HTTP methods and status codes
- **Visibility** - Requests contain all necessary information
- **Reliability** - Idempotent operations for safe retries
- **Discoverability** - Hypermedia-driven APIs are self-documenting

## RESTful Naming Conventions

### Endpoint Structure

```
HTTP Method + Resource Collection + Resource Identifier

GET    /posts           → List all posts
GET    /posts/123       → Get post with ID 123
POST   /posts           → Create a new post
PUT    /posts/123       → Update post with ID 123
DELETE /posts/123       → Delete post with ID 123
GET    /posts/123/comments → Get comments for post 123
POST   /posts/123/comments → Add comment to post 123
```

### This Project's RESTful Endpoints

| Method   | Endpoint                  | Purpose                                    |
| -------- | ------------------------- | ------------------------------------------ |
| `POST`   | `/sign-up`                | Create new user account                    |
| `POST`   | `/log-in`                 | Authenticate and receive JWT               |
| `GET`    | `/posts`                  | List all posts (published only for guests) |
| `GET`    | `/posts/:postId`          | Get single post by ID                      |
| `POST`   | `/posts`                  | Create new post (author only)              |
| `PUT`    | `/posts/:postId`          | Update post (author only)                  |
| `DELETE` | `/posts/:postId`          | Delete post (author only)                  |
| `GET`    | `/posts/author/:authorId` | Get posts by author                        |
| `GET`    | `/posts/:postId/comments` | Get comments for a post                    |
| `POST`   | `/posts/:postId/comments` | Add comment to a post (public)             |
| `DELETE` | `/comments/:commentId`    | Delete comment (post author only)          |

## HTTP Methods/Verbs

| Method   | Idempotent? | Safe?  | Purpose           | This Project                            |
| -------- | ----------- | ------ | ----------------- | --------------------------------------- |
| `GET`    | ✅ Yes      | ✅ Yes | Retrieve resource | List posts, get post, get comments      |
| `POST`   | ❌ No       | ❌ No  | Create resource   | Create post, add comment, login, signup |
| `PUT`    | ✅ Yes      | ❌ No  | Full update       | Update entire post                      |
| `PATCH`  | ❌ No       | ❌ No  | Partial update    | Not used                                |
| `DELETE` | ✅ Yes      | ❌ No  | Remove resource   | Delete post, delete comment             |

### Idempotency Explained

```javascript
// GET - Idempotent (same request, same response)
GET /posts/123 → Always returns post 123 (unless deleted)

// PUT - Idempotent (multiple identical requests have same effect)
PUT /posts/123 { title: "New Title" } → First time updates, second time does nothing

// POST - NOT idempotent (each request creates new resource)
POST /posts { title: "Post" } → Creates new post each time

// DELETE - Idempotent (first deletes, subsequent find nothing to delete)
DELETE /posts/123 → First deletes, subsequent returns 404
```

## Same Origin Policy (SOP)

**Same Origin Policy** is a browser security mechanism that restricts how a document or script from one origin can interact with resources from another origin.

### What Defines an Origin?

```
https://api.example.com:443/posts
^             ^          ^
protocol     host      port

Two URLs have the SAME origin if protocol, host, AND port all match.
```

### Origin Comparison Examples

| URL A                     | URL B                      | Same Origin?     |
| ------------------------- | -------------------------- | ---------------- |
| `https://example.com`     | `https://example.com`      | ✅ Yes           |
| `https://example.com`     | `http://example.com`       | ❌ No (protocol) |
| `https://example.com`     | `https://api.example.com`  | ❌ No (host)     |
| `https://example.com:443` | `https://example.com:3000` | ❌ No (port)     |

## CORS (Cross-Origin Resource Sharing)

**CORS** is a mechanism that allows servers to specify which origins are permitted to access their resources, relaxing the Same Origin Policy.

### Why CORS?

Without CORS, a frontend running at `http://localhost:3000` cannot make requests to an API at `http://localhost:5000` because they are different origins.

### CORS Headers Explained

| Header                             | Purpose                    | Example                        |
| ---------------------------------- | -------------------------- | ------------------------------ |
| `Access-Control-Allow-Origin`      | Specifies allowed origins  | `*` or `http://localhost:3000` |
| `Access-Control-Allow-Methods`     | Allowed HTTP methods       | `GET, POST, PUT, DELETE`       |
| `Access-Control-Allow-Headers`     | Allowed request headers    | `Content-Type, Authorization`  |
| `Access-Control-Allow-Credentials` | Allow cookies/auth headers | `true`                         |
| `Access-Control-Max-Age`           | Cache preflight response   | `86400` (24 hours)             |

### CORS in Express (This Project)

#### Global CORS Configuration

```javascript
// index.js - Apply CORS to all routes
import cors from "cors";

const app = express();
app.use(cors()); // Allows all origins (development only)
```

#### Production CORS (Recommended)

```javascript
// Restrict to specific origins
const allowedOrigins = [
  "https://myblog.com",
  "https://admin.myblog.com",
  "http://localhost:5173", // Development only
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies/auth headers
    maxAge: 86400, // Cache preflight for 24 hours
  }),
);
```

#### Route-Specific CORS

```javascript
// Apply CORS to specific routes only
import cors from "cors";

const corsOptions = {
  origin: "https://trusted-frontend.com",
  optionsSuccessStatus: 200,
};

app.get("/public-data", cors(), (req, res) => {
  res.json({ data: "Public" });
});

app.post("/sensitive-data", cors(corsOptions), (req, res) => {
  res.json({ data: "Sensitive" });
});
```

## Token Authentication vs Session Authentication

### Session-Based Authentication

```javascript
// How sessions work
1. User submits login credentials
2. Server creates session in database
3. Server sends cookie with session ID
4. Browser stores cookie
5. Subsequent requests include cookie
6. Server looks up session from cookie
7. Server attaches user to request
```

### Token-Based Authentication (JWT)

```javascript
// How JWTs work
1. User submits login credentials
2. Server verifies credentials
3. Server creates signed JWT token
4. Server returns token to client
5. Client stores token (localStorage/sessionStorage)
6. Client includes token in Authorization header
7. Server verifies token signature and extracts user
```

### Comparison

| Aspect              | Session                    | JWT Token                            |
| ------------------- | -------------------------- | ------------------------------------ |
| **Storage**         | Server-side (database)     | Client-side (token)                  |
| **Scalability**     | Needs shared session store | Stateless, any server can verify     |
| **Logout**          | Delete session from DB     | Token remains valid until expiration |
| **Revocation**      | Immediate                  | Requires blacklist or short expiry   |
| **Size**            | Small (session ID)         | Larger (contains user data)          |
| **Mobile Friendly** | Requires cookie handling   | Works with any client                |
| **CSRF Protection** | Built-in with SameSite     | Not vulnerable                       |

## JSON Web Tokens (JWT)

### JWT Structure

A JWT consists of three parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

```
┌──────────────────┐  ┌────────────────────┐  ┌───────────────────────────────────┐
│     Header       │  │     Payload        │  │    Signature                      │
├──────────────────┤  ├────────────────────┤  ├───────────────────────────────────┤
│ {                │  │ {                  │  │ HMACSHA256(                       │
│   "alg": "HS256",│  │   "id": "12345",   │  │   base64UrlEncode(header) + "." + |
│   "typ": "JWT"   │  │   "iat": 1516239022│  │   base64UrlEncode(payload),       |
│ }                │  │ }                  │  │   secret)                         │
└──────────────────┘  └────────────────────┘  └───────────────────────────────────┘
```

### Creating JWTs (Signing)

```javascript
// controllers/log-in.js
import jwt from "jsonwebtoken";

const logIn = async (req, res) => {
  const user = await userDB.getUserByUsername(req.body.username);
  // ... validate password ...

  // Create token with user ID in payload
  const token = jwt.sign(
    { id: user.id }, // Payload (user data)
    process.env.JWTTOKEN, // Secret key
    { expiresIn: "7d" }, // Optional: expiration
  );

  res.json({ token: "bearer " + token });
};
```

### Verifying JWTs

```javascript
// auth/jwtStrategy.js - Passport-JWT strategy
import passportJwt from "passport-jwt";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTTOKEN,
};

const strategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  // jwt_payload contains the decoded token data
  const user = await userDB.getUserById(jwt_payload.id);

  if (user) {
    return done(null, user);
  }
  return done(null, false);
});
```

### Authorization Header

```http
GET /posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Custom Authentication Middleware

```javascript
// controllers/auth-validator.js
import passport from "passport";

function authenticate(requireAuthor = false, rejectOnFail = true) {
  return function (req, res, next) {
    return passport.authenticate(
      "jwt",
      { session: false },
      (error, user, info) => {
        if (error) {
          return next(error);
        }

        if (!user && rejectOnFail) {
          return res
            .status(401)
            .json({ errors: ["Not authorized, invalid token"] });
        }

        if (requireAuthor && !user.isAuthor) {
          return res.status(403).json({
            errors: [
              "Not authorized, you must be an author to access this resource",
            ],
          });
        }

        req.user = user;
        next();
      },
    )(req, res, next);
  };
}

export default authenticate;
```

### Using Authentication Middleware

```javascript
// controllers/post.js
const createPost = [
  authenticate(true), // Requires authentication AND author role
  validatePostInputs,
  async function createPost(req, res) {
    // req.user is available here
    const post = {
      title: req.body.title,
      content: req.body.content,
      authorId: req.user.id, // Automatically from authenticated user
    };
    // ...
  },
];
```

### Token Expiration

JWTs can have expiration times to limit their validity window:

```javascript
// 7 days expiration
jwt.sign({ id: user.id }, process.env.JWTTOKEN, { expiresIn: "7d" });

// 1 hour expiration
jwt.sign({ id: user.id }, process.env.JWTTOKEN, { expiresIn: "1h" });

// 30 minutes
jwt.sign({ id: user.id }, process.env.JWTTOKEN, { expiresIn: "30m" });
```

## API Response Formats

### Success Responses

```json
// GET /posts
{
  "posts": [
    { "id": "1", "title": "First Post", "content": "..." }
  ]
}

// POST /posts (create)
{
  "success": "Post created succesfully!",
  "post": { "id": "2", "title": "New Post", ... }
}

// PUT /posts/1 (update)
{
  "success": "Post updated succesfully!",
  "post": { ... }
}

// DELETE /posts/1
{
  "success": "Post deleted sucessfuly",
  "post": { ... }
}
```

### Error Responses

```json
// 401 - Unauthorized (no token)
{
  "errors": ["Not authorized, invalid token"]
}

// 403 - Forbidden (not author)
{
  "errors": ["Not authorized, you must be an author to access this resource"]
}

// 409 - Validation Error
{
  "errors": ["Post title can't be empty!", "Post content can't be empty!"]
}

// 500 - Server Error
{
  "errors": ["Error creating new post!"]
}
```

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SIGN UP FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  POST /sign-up { username, password, isAuthor }                         │
│                    ↓                                                    │
│  1. Validate input (express-validator)                                  │
│  2. Check username uniqueness                                           │
│  3. bcrypt.hash(password, 10)                                           │
│  4. prisma.user.create()                                                │
│  5. Response: { message: "User created successfully" }                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           LOGIN FLOW                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  POST /log-in { username, password }                                    │
│                    ↓                                                    │
│  1. Find user by username                                               │
│  2. bcrypt.compare(password, user.password)                             │
│  3. jwt.sign({ id: user.id }, JWTTOKEN)                                 │
│  4. Response: { token: "bearer eyJhbGc...", username, userId }          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATED REQUEST                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  GET /posts                                                             │
│  Authorization: Bearer eyJhbGc...                                       │
│                    ↓                                                    │
│  1. Passport-JWT extracts token from Authorization header               │
│  2. JWTStrategy verifies signature with JWTTOKEN                        │
│  3. Decodes payload to get user.id                                      │
│  4. Fetches user from database                                          │
│  5. Attaches user to req.user                                           │
│  6. Route handler processes request                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Project Architecture

```
blog-api/
├── index.js                 # Express app with CORS configuration
├── auth/
│   └── jwtStrategy.js       # Passport-JWT strategy
├── controllers/
│   ├── auth-validator.js    # JWT authentication middleware
│   ├── input-validator.js   # Express-validator helper
│   ├── log-in.js            # Login + JWT generation
│   ├── sign-up.js           # User registration
│   ├── post.js              # Post CRUD with auth
│   └── comment.js           # Comment operations
├── db/                      # Prisma database queries
├── routes/                  # Route definitions
├── prisma/
│   └── schema.prisma        # Database schema
└── generated/               # Prisma Client (auto-generated)
```

## What I learned

### REST API Design

- **Resources** - Nouns, not verbs (use `/posts`, not `/getPosts`)
- **HTTP Methods** - GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes** - 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
- **Stateless** - Each request contains all necessary information

### CORS

- **Same Origin Policy** - Browser security restricting cross-origin requests
- **CORS Headers** - `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, etc.
- **Preflight** - OPTIONS request before non-simple requests
- **Configuration** - Global (`app.use(cors())`) or route-specific

### JWT Authentication

- **Structure** - Header.Payload.Signature
- **Stateless** - No session storage needed
- **Bearer Token** - Sent in Authorization header
- **Expiration** - Limit token lifetime for security
- **Passport-JWT** - Extract and verify tokens automatically

### Token vs Session

- **Session** - Server-side storage, immediate revocation, stateful
- **JWT** - Client-side storage, no revocation (without blacklist), stateless
