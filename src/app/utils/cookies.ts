// utils/cookies.ts

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(nameEQ)) {
      const value = cookie.substring(nameEQ.length);
      return decodeURIComponent(value); // Decode the value
    }
  }
  return null;
}

export function setCookie(name: string, value: string, days: number): void {
  if (typeof document !== "undefined") {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; ${expires}; path=/`;
  }
}

export function deleteCookie(name: string): void {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
}
