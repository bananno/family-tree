export default function requireAdmin(req, res, next) {
  if (req.session?.user?.admin) {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Forbidden' });
  }
}
