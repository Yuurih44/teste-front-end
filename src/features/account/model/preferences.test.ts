import { expect, test } from "vitest";
import {
  readProfile,
  readSubscription,
  saveProfile,
  saveSubscription,
} from "./preferences";

test("perfil e assinatura são separados e podem ser removidos da sessão", () => {
  const profile = { name: "Yuri", email: "yuri@example.com" };
  const subscription = { email: profile.email, frequency: "mensal" as const };
  expect(saveProfile(profile)).toBe(true);
  expect(saveSubscription(subscription)).toBe(true);
  expect(readProfile()).toEqual(profile);
  expect(readSubscription()).toEqual(subscription);
  saveProfile(null);
  expect(readProfile()).toBeNull();
  expect(readSubscription()).toEqual(subscription);
  saveSubscription(null);
  expect(readSubscription()).toBeNull();
});

test("dados inválidos no armazenamento não simulam um perfil ou assinatura válidos", () => {
  sessionStorage.setItem("econverse:demo-profile:v1", "{inválido");
  sessionStorage.setItem(
    "econverse:demo-subscription:v1",
    JSON.stringify({ email: "teste@example.com", frequency: "diária" }),
  );
  expect(readProfile()).toBeNull();
  expect(readSubscription()).toBeNull();
});
