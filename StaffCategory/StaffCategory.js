import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import { changeMaximize } from 'app/store/RightBarSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectUser } from 'app/store/userSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from 'src/app/main/administration/store/permissionsSlice';
import Error404Page from '../../404/Error404Page';
import reducer from "./index"
import StaffCategoryList from './StaffCategoryList';


import {
  getStaffCategories,
  selectStaffCategories,
  selectCategoriesSearchText,
} from './StaffCategoriesSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function StaffApp() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const categories = useSelector(selectStaffCategories);
  const { t } = useTranslation('navigation');
  const searchText = useSelector(selectCategoriesSearchText);

  const filteredData = categories?.filter((cat) =>
    cat.translations.some((trs) => trs.title.toLowerCase().includes(searchText.toLowerCase()))
  );

  useDeepCompareEffect(() => {
    dispatch(getStaffCategories());
  }, [dispatch]);



  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: '/view/staff/category' }));
    const globalRegex = new RegExp('edit', 'gm');

    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  const Staffcategoriesteps = [
    {
      element: '#categories',
      // add
      intro: t('ADDSTEP', { name: t('CATEGORIES') }),
    },
    {
      element: '#two',
      intro: t('VIEWSTEP', { name: t('CATEGORIES') }),
    },
    {
      element: '#three',
      intro: t('QUESTIONSTEP5', { name: t('CATEGORIES') }),
    },
  ];

  return  canView ? (
    <>
      {console.log(categories,"from StaffCategory.js")}
    <Root
      header={
        <HeaderContent
          id="StaffCategories"
          steps={Staffcategoriesteps}
          instruction={t('INSTRUCTION', { name: t('CATEGORIES').toLowerCase() })}
          name="CATEGORIES"
          addButtonTo="new/edit"
          disableSearch
          disableAddButton={!canManage}
        />
      }
      content={<StaffCategoryList canManage={canManage}  filteredData={filteredData}/>}
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto="/view/staff/category" name="CATEGORIES">
          <Outlet />
        </RightBarLayout>
      }
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={maximize ? '100%' : 640}
      scroll="content"
    />
    </>
  ) : 
  (
    <Error404Page />
  );

}

export default withReducer('StaffApp', reducer )(StaffApp);
