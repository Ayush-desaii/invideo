class LoginController {
    constructor(authService) {
        this.authService = authService;
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const token = await this.authService.authenticate(email, password);

            res.cookie("auth_token", token, {
                httpOnly: true, // Prevents access via JavaScript (more secure)
                secure: process.env.NODE_ENV === "production", // Only send on HTTPS in production
                maxAge: 3600000, // 1 hour
            });

            res.status(200).json({ success: true, token });
        } catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    }

    async logout(req, res) {
        try {
            await this.authService.logout(req.user);
            res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default LoginController;
