/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new customer account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Test@12345
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticates a user and returns access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Test@12345
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: User account is inactive
 */

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     description: Generates a new access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 *       403:
 *         description: User account is inactive
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Revokes the provided refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Invalid refresh token
 */

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get authenticated user profile
 *     description: Returns the profile of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Authentication required or access token is invalid
 *       404:
 *         description: User not found
 */
