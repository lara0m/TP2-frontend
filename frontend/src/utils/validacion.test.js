import { describe, it, expect } from "vitest";
import { validateRegisterForm, generateNameFromEmail } from "./validacion";

describe("validateRegisterForm", () => {
  it("devuelve error si las contraseñas no coinciden", () => {
    const result = validateRegisterForm("abc123", "abc456");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Las contraseñas no coinciden");
  });

  it("devuelve error si la contraseña tiene menos de 6 caracteres", () => {
    const result = validateRegisterForm("abc", "abc");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("La contraseña debe tener al menos 6 caracteres");
  });

  it("devuelve válido si la contraseña coincide y tiene al menos 6 caracteres", () => {
    const result = validateRegisterForm("segura123", "segura123");
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });
});

describe("generateNameFromEmail", () => {
  it("extrae el nombre de usuario antes del @", () => {
    const result = generateNameFromEmail("lara@gmail.com");
    expect(result).toBe("lara");
  });
});