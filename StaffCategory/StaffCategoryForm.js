import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo,useState } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import createTranslationData from '@helpers/createTranslationData';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useTranslation } from 'react-i18next';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import {
  getPermissionsByPage,
  selectPermission,
} from 'src/app/main/administration/store/permissionsSlice';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import InputController from 'app/shared-components/fields/InputController';
import { Checkbox, FormControlLabel,FormHelperText } from '@mui/material';
import { t } from 'i18next';



import {
  addCategory,
  getCategoryById,
  newCategory,
  removeCategory,
  resetCategory,
  selectCategory,
  selectLoading,
  updateCategory,
} from './StaffCategorySlice';

import { getStaffCategories } from './StaffCategoriesSlice';




/**
 * Form Validation Schema
 * 
 *   const schema = yup.object().shape({
    slug: yup
      .string()
      .matches(/^[a-z0-9-_]+$/, 'Only alphabets are allowed for this field ')
      .test('unique_slug_validation', 'that slug already used', (val) => {
        return category.every((ls) => ls.slug !== val || +id === +ls.id);
      })
      .trim(),
 * 
 * 
 */
const schema = yup.object().shape({
  title1: yup.string().trim().required('You must enter a name'),
    slug1: yup
      .string()
      .matches(/^[a-z0-9-_]+$/, 'Only alphabets are allowed for this field ')
      .trim(),
  long_description1: yup.string().test('required', 'You must enter an armenian text', (v) => {
    if (!v) return false; 

    const regex = /(<([^>]+)>)/gi;
    const plainText = v.replace(regex, '').replace(/&nbsp;/g, '').trim(); 
    return !!plainText;
  }),
 
  
});


const StaffCategoryForm = (props) => {
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);

  const category = useSelector(selectCategory);
  const loading = useSelector(selectLoading);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);

  const edit = routeParams.id !== 'new';

  const { control, watch,reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

    const { isValid, dirtyFields, errors } = formState;
    const [editorData, setEditorData] = useState({});

    const form = watch()

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'categories' }));
    if (!canManage) {
      navigate(`view/staff/category`);
    }
  }, [canManage, dispatch, navigate, userId]);

  useEffect(() => {
    dispatch(resetCategory());
    dispatch(getStaffCategories());
    if (routeParams.id !== 'new') {
      dispatch(getCategoryById(routeParams.id));
      setEditorData({})
    } else {
      dispatch(newCategory());
    }
  }, [dispatch, routeParams.id, userId]);  /* routerParams */

  const copyCategory = useMemo(() => {
    return { ...category };
  }, [category]);





  useEffect(() => {
    console.log(category,"cccccccccccccc")
    if (category) {
      if (edit) {
        category.translations.forEach((item, i) => {
          copyCategory[`title${item.language_id}`] = item.title;
           copyCategory[`long_description${item.language_id}`] = item.long_description
          ? JSON.parse(item.long_description).htmlValue
          : '';
        });
              copyCategory.slug = category.slug
       
      } else {
        translationLanguages.forEach((language) => {
          copyCategory[`title${language.id}`] = '';
           copyCategory[`long_description${language.id}`] = '';
        });
        copyCategory.slug = ''
      }
      reset({ ...copyCategory });
    }
  }, [category, edit, reset, copyCategory, ]);  
  
useEffect(() => {
    reset({ ...copyCategory });
  }, [copyCategory, category, reset]);


  if (loading) {
    return <FuseLoading />;
  }

  /**
   * Form Submit
   */

async function onSubmit(data) {
    console.log(data,"onsubmitData")

  data.title = createTranslationData(data, 'title');
  data.long_description = editorData;

  if (routeParams.id === 'new') {
    await dispatch(addCategory(data)).finally(() => {
      dispatch(getStaffCategories());
      navigate(`/view/staff/category`);
    });
  } else {
    data.id = routeParams.id;
    //  delete data.slug;
    await dispatch(updateCategory(data)).finally(() => {
       dispatch(getCategoryById(routeParams.id));
      dispatch(getStaffCategories());
      navigate(`/view/staff/category`);
    });
  }
}


  return (
    <>
      <Box className="relative flex flex-col flex-auto items-center px-24">
        <InputTranslationController control={control} errors={errors} name="title" label='CATEGORY'  />
       {!edit &&  <InputController control={control} name="slug" errors={errors} disabled={edit} /> } 

          <EditorTranslationController
          control={control}
          name="long_description"
          setEditorData={setEditorData}
          label="STAFFCATEGORIES"    
    />
     </Box>

      <FormButtons
        edit={routeParams.id !== 'new'}
        onDeleteFunction={() => {
          dispatch(removeCategory(category?.id)).then(() => {
             dispatch(getStaffCategories())
            navigate('/view/staff/category');
          });
        }}
        onSubmitFunction={handleSubmit(onSubmit)}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
      />
    </>
  );
};

export default StaffCategoryForm;












