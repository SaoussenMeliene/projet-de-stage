/**
 * Configuration du monitoring et analytics professionnel
 * Sentry pour les erreurs, Google Analytics pour les métriques utilisateur
 */

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Configuration Sentry
export const initSentry = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_ENVIRONMENT || 'production',
      
      // Intégrations
      integrations: [
        new BrowserTracing({
          // Tracing des routes React Router
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
          ),
        }),
      ],

      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% des transactions
      
      // Release tracking
      release: import.meta.env.VITE_APP_VERSION,
      
      // Filtrage des erreurs
      beforeSend(event, hint) {
        // Filtrer les erreurs non critiques
        if (event.exception) {
          const error = hint.originalException;
          
          // Ignorer les erreurs réseau temporaires
          if (error instanceof Error && error.message.includes('NetworkError')) {
            return null;
          }
          
          // Ignorer les erreurs d'extension de navigateur
          if (error instanceof Error && error.stack?.includes('extension://')) {
            return null;
          }
        }
        
        return event;
      },
      
      // Configuration des breadcrumbs
      beforeBreadcrumb(breadcrumb) {
        // Filtrer les breadcrumbs sensibles
        if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
          return null;
        }
        
        return breadcrumb;
      },
      
      // Tags par défaut
      initialScope: {
        tags: {
          component: 'frontend',
          framework: 'react',
        },
      },
    });
  }
};

// Wrapper pour capturer les erreurs avec contexte
export const captureError = (
  error: Error,
  context?: {
    user?: { id: string; email: string };
    extra?: Record<string, any>;
    tags?: Record<string, string>;
    level?: Sentry.SeverityLevel;
  }
) => {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser(context.user);
    }
    
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    
    if (context?.level) {
      scope.setLevel(context.level);
    }
    
    Sentry.captureException(error);
  });
};

// Analytics personnalisés
class Analytics {
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    
    // Google Analytics 4
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      this.initGoogleAnalytics();
    }
    
    // Hotjar
    if (import.meta.env.VITE_HOTJAR_ID) {
      this.initHotjar();
    }
    
    this.isInitialized = true;
  }

  private initGoogleAnalytics() {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    // Charger le script GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    
    // Configuration GA4
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    
    gtag('js', new Date());
    gtag('config', measurementId, {
      // Configuration GDPR
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    
    // Exposer gtag globalement
    (window as any).gtag = gtag;
  }

  private initHotjar() {
    const hjid = import.meta.env.VITE_HOTJAR_ID;
    const hjsv = import.meta.env.VITE_HOTJAR_VERSION || 6;
    
    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function(...args: any[]) {
        (h.hj.q = h.hj.q || []).push(args);
      };
      h._hjSettings = { hjid, hjsv };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  // Tracking des événements
  trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'engagement',
        event_label: parameters?.label,
        value: parameters?.value,
        ...parameters,
      });
    }
    
    // Sentry breadcrumb pour le debugging
    Sentry.addBreadcrumb({
      category: 'analytics',
      message: `Event: ${eventName}`,
      data: parameters,
      level: 'info',
    });
  }

  // Tracking des pages
  trackPageView(path: string, title?: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title,
      });
    }
  }

  // Tracking des utilisateurs
  setUser(userId: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        user_id: userId,
        custom_map: properties,
      });
    }
    
    // Sentry user context
    Sentry.setUser({
      id: userId,
      ...properties,
    });
  }

  // Métriques de performance personnalisées
  trackPerformance(metricName: string, value: number, unit = 'ms') {
    this.trackEvent('performance_metric', {
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit,
    });
  }

  // Tracking des erreurs business
  trackBusinessError(errorType: string, errorMessage: string, context?: Record<string, any>) {
    this.trackEvent('business_error', {
      error_type: errorType,
      error_message: errorMessage,
      ...context,
    });
    
    // Aussi envoyer à Sentry avec un niveau warning
    Sentry.withScope((scope) => {
      scope.setLevel('warning');
      scope.setTag('error_type', 'business');
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      Sentry.captureMessage(`Business Error: ${errorType} - ${errorMessage}`);
    });
  }

  // Tracking des conversions
  trackConversion(conversionType: string, value?: number) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      value,
    });
  }
}

// Instance singleton
export const analytics = new Analytics();

// Métriques de performance Web Vitals
export const trackWebVitals = () => {
  if (import.meta.env.PROD) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => analytics.trackPerformance('CLS', metric.value * 1000));
      getFID((metric) => analytics.trackPerformance('FID', metric.value));
      getFCP((metric) => analytics.trackPerformance('FCP', metric.value));
      getLCP((metric) => analytics.trackPerformance('LCP', metric.value));
      getTTFB((metric) => analytics.trackPerformance('TTFB', metric.value));
    });
  }
};

// Hook React pour le tracking automatique
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    analytics.trackPageView(location.pathname + location.search);
  }, [location]);
};

// HOC pour wrapper les composants avec error boundary et tracking
export const withErrorTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: ({ error, resetError }) => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Une erreur s'est produite
          </h2>
          <p className="text-gray-600 mb-6">
            Nous nous excusons pour ce désagrément.
          </p>
          <button
            onClick={resetError}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    ),
    beforeCapture: (scope) => {
      scope.setTag('component', componentName || Component.name);
    },
  });
};

// Types pour TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    hj: (...args: any[]) => void;
  }
}
