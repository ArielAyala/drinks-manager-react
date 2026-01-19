// Formatear número como guaraníes
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PY', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' ₲';
}

// Formatear fecha para mostrar
export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-PY', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// Obtener fecha actual en formato YYYY-MM-DD
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Parsear input numérico (sin decimales)
export function parseIntegerInput(value: string): number {
  const parsed = parseInt(value.replace(/\D/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
}
