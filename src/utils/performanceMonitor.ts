export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();

  static startMeasurement(name: string): void {
    if (typeof window !== "undefined" && window.performance) {
      this.measurements.set(name, window.performance.now());
    }
  }

  static endMeasurement(name: string): number {
    if (typeof window !== "undefined" && window.performance) {
      const startTime = this.measurements.get(name);
      if (startTime) {
        const duration = window.performance.now() - startTime;
        this.measurements.delete(name);

        if (import.meta.env.DEV) {
          console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
        }

        this.reportToAnalytics(name, duration);

        return duration;
      }
    }
    return 0;
  }

  static measureComponent(componentName: string) {
    return {
      onRenderStart: () => this.startMeasurement(`render-${componentName}`),
      onRenderEnd: () => this.endMeasurement(`render-${componentName}`),
    };
  }

  static measureApiCall(endpoint: string) {
    return {
      onRequestStart: () => this.startMeasurement(`api-${endpoint}`),
      onRequestEnd: () => this.endMeasurement(`api-${endpoint}`),
    };
  }

  static getCoreWebVitals(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve({});
        return;
      }

      const vitals: any = {};

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          vitals.fid = (entry as any).processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ["first-input"] });

      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        vitals.cls = clsValue;
      }).observe({ entryTypes: ["layout-shift"] });

      setTimeout(() => resolve(vitals), 3000);
    });
  }

  static monitorBundleLoading(): void {
    if (typeof window === "undefined") return;

    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      const metrics = {
        ttfb: navigation.responseStart - navigation.requestStart,
        domLoad:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        windowLoad: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoad: navigation.loadEventEnd - navigation.fetchStart,
      };

      if (import.meta.env.DEV) {
        console.table(metrics);
      }

      this.reportToAnalytics("page-load", metrics);
    });
  }

  private static reportToAnalytics(event: string, data: any): void {
    if (import.meta.env.PROD) {
      console.log("Analytics:", event, data);
    }
  }
}
