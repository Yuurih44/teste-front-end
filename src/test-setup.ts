import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(cleanup);
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
HTMLElement.prototype.scrollTo = function () {};

HTMLElement.prototype.scrollIntoView = function () {};

beforeEach(() => localStorage.clear());
