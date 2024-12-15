export const logout = (req : any, res : any) => {
    res.clearCookie('auth_token');
    res.status(200).json({ message: 'Logged out successfully' });
  };