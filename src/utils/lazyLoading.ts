import { lazy, LazyExoticComponent, ComponentType } from "react";

export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  componentName: string = "Component"
): LazyExoticComponent<T> {
  return lazy(async () => {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        return await componentImport();
      } catch (error) {
        retryCount++;
        console.warn(
          `Failed to load ${componentName}, attempt ${retryCount}/${maxRetries}`
        );

        if (retryCount >= maxRetries) {
          console.error(
            `Failed to load ${componentName} after ${maxRetries} attempts`
          );
          throw error;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retryCount) * 1000)
        );
      }
    }

    throw new Error(`Failed to load ${componentName}`);
  });
}

export function preloadComponent(componentImport: () => Promise<any>): void {
  if (typeof window !== "undefined") {
    requestIdleCallback(() => {
      componentImport().catch(() => {});
    });
  }
}

export function createLazyRoute<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  routeName: string
) {
  const preload = () => preloadComponent(componentImport);

  const LazyComponent = lazyWithRetry(componentImport, routeName);

  return {
    Component: LazyComponent,
    preload,
  };
}

export const LazyRoutes = {
  Home: createLazyRoute(() => import("../pages/Home/"), "Home"),
  Login: createLazyRoute(() => import("../pages/Login/"), "Login"),
  Register: createLazyRoute(() => import("../pages/Register"), "Register"),
  Account: createLazyRoute(() => import("../pages/Account"), "Account"),
  CreditApplication: createLazyRoute(
    () => import("../pages/CreditApplication"),
    "CreditApplication"
  ),
};
