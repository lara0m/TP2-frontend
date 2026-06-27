export function validateRegisterForm(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { valid: false, error: "Las contraseñas no coinciden" };
  }

  if (password.length < 6) {
    return { valid: false, error: "La contraseña debe tener al menos 6 caracteres" };
  }

  return { valid: true, error: null };
}

export function generateNameFromEmail(email) {
  return email.split("@")[0];
}