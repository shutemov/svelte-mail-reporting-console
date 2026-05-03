/// <reference types="@sveltejs/kit" />
declare global {
  namespace App {
    interface Locals {
      user: import('$lib/domains/types').DemoUser;
    }
    interface PageData {
      user: import('$lib/domains/types').DemoUser;
    }
  }
}
export {};