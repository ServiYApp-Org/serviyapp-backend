/**
 * Genera la URL de redirección al frontend según el rol, el estado del registro y el token JWT.
 */
export const getGoogleRedirectUrl = (
  isCompleted: boolean,
  role: string,
  token: string,
): string => {
  if (isCompleted) {
    // Si el perfil está completo  redirigir al dashboard correspondiente
    switch (role) {
      case 'user':
        return `${process.env.FRONTEND_USER_HOME}?token=${token}`;
      case 'provider':
        return `${process.env.FRONTEND_PROVIDER_HOME}?token=${token}`;
      case 'admin':
        return `${process.env.FRONTEND_ADMIN_HOME}?token=${token}`;
      default:
        return process.env.FRONTEND_BASE_URL || '/';
    }
  } else {
    // Si el perfil no está completo → redirigir al flujo de completar registro
    return role === 'provider'
      ? `${process.env.FRONTEND_GOOGLE_PROVIDER_INCOMPLETE}?role=${role}&token=${token}`
      : `${process.env.FRONTEND_GOOGLE_USER_INCOMPLETE}?role=${role}&token=${token}`;
  }
};
