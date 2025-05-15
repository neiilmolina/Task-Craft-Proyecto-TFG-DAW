function todosCamposVacios(obj: Record<string, any>): boolean {
  return Object.values(obj).every(
    (valor) => typeof valor === "string" && valor.trim() === ""
  );
}
