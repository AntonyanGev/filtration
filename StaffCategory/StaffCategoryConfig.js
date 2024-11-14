import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';
import StaffCategoryForm from "./StaffCategoryForm"



const StaffCategoryApp = lazy(() => import('./StaffCategory'));

const StaffCategoriesApp2= {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.superadmin,
  routes: [
    {
      path: 'view/staff/category',
      element: <StaffCategoryApp/>,
      children: [
        {
          path: ':id/edit',
          element: <StaffCategoryForm/>,
        },
      ],
    },
  ],
};

export default StaffCategoriesApp2;
