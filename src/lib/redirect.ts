// lib/redirect.ts
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const handleLoginRedirect = (
  router: AppRouterInstance,
  role?: string
) => {
  if (role === 'surgeon') {
    router.replace('/dashboard');
  } else {
    // For other roles or no role, check localStorage for homeJobFormData
    const formData = localStorage.getItem('homeJobFormData');
    if (formData) {
      router.replace('/dashboard/add');
    } else {
      router.replace('/dashboard');
    }
  }
  router.refresh();
};
