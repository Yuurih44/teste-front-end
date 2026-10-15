export interface Profile {
  name: string;
  email: string;
}
export interface Subscription {
  email: string;
  frequency: "semanal" | "mensal";
}
const PROFILE_KEY = "econverse:demo-profile:v1";
const SUBSCRIPTION_KEY = "econverse:demo-subscription:v1";
const validEmail = (value: unknown): value is string =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function read(key: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(key) || "null");
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown): boolean {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function readProfile(): Profile | null {
  const value = read(PROFILE_KEY);
  return value &&
    typeof value.name === "string" &&
    value.name.trim().length >= 2 &&
    validEmail(value.email)
    ? { name: value.name, email: value.email }
    : null;
}
export function readSubscription(): Subscription | null {
  const value = read(SUBSCRIPTION_KEY);
  return value &&
    validEmail(value.email) &&
    (value.frequency === "semanal" || value.frequency === "mensal")
    ? { email: value.email, frequency: value.frequency }
    : null;
}
export const saveProfile = (value: Profile | null) => write(PROFILE_KEY, value);
export const saveSubscription = (value: Subscription | null) =>
  write(SUBSCRIPTION_KEY, value);
