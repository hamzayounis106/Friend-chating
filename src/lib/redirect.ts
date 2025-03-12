import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const handleLoginRedirect = (
  router: AppRouterInstance,
  role?: string
) => {
  if (role === 'surgeon') {
    router.replace('/dashboard');
  } else if (role === 'pending') {
    console.log('Route trigger role pending 😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊');
    router.replace('/update-role');
  } else {
    const formData = localStorage.getItem('homeJobFormData');
    if (formData) {
      router.replace('/dashboard/add');
    } else {
      router.replace('/dashboard');
    }
  }
  router.refresh();
};
