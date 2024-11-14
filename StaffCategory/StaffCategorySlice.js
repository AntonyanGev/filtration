import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history  from "@history"
import { $api } from '@api/http';
import { addStuffCategoryURL, deleteStuffCategoryURL,  editStuffCategoryURL, getStuffCategoryByIdURL, getStuffCategoryURL } from '@api/url';
import createEditorDataForDB from '@helpers/createEditorDataForDB';
import StaffCategoryModel from './StaffCategoryModel';


export const getCategoryById = createAsyncThunk('categories/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getStuffCategoryByIdURL}/${+id}`);
    console.log(response?.data?.category,"getCategoryByid function")
    return response?.data?.category;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});






export const addCategory = createAsyncThunk('categories/add', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('title', JSON.stringify(data?.title));
     fd.append('long_description', JSON.stringify(createEditorDataForDB(data?.long_description)));
      fd.append('slug',data?.slug);
    const response = await $api.post(addStuffCategoryURL, fd);
    return response?.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});


export const updateCategory = createAsyncThunk('categories/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    console.log(data,"dataupdate")
    if(data.title){
     fd.append('title', JSON.stringify(data.title));
    }
       if(data.long_description){
    fd.append('long_description', JSON.stringify(createEditorDataForDB(data?.long_description)));
       }
    if(data.slug){
    fd.append('slug',data?.slug)
    }
     fd.append('id', data.id)
    const response = await $api.post(editStuffCategoryURL, fd);
    return response?.data?.message;
  } catch (err) {
    console.log(thunkAPI.rejectWithValue(err.message),"sss")
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeCategory = createAsyncThunk('categories/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteStuffCategoryURL}/${id}`);
    return {
      id,
      message: response?.data?.message,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});


const categorySlice = createSlice({
  name: 'category',
  initialState: 
  {
    loading: false,
    error: '',
    item: null,
  },
  reducers: {
    newCategory: (state) => ({
      ...state,
      item: StaffCategoryModel(),
    }),
    resetCategory: () => ({
      loading: false,
      error: '',
      item: null,
    }),
  },

  extraReducers: {
    [getCategoryById.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategoryById.fulfilled]: (state, action) => {
      state.error = '';
      state.item = action.payload;
      state.loading = false;
    },
    [getCategoryById.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    [addCategory.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess (action.payload.message || "The Stuff Category Successfully Added");
    },
    [addCategory.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },


     [updateCategory.fulfilled]: (state, action) => notifySuccess( "The Stuff Category Successfully edited"),
    [updateCategory.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
   
    [removeCategory.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [removeCategory.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
  },
});

export const { newCategory, resetCategory } = categorySlice.actions;

export const selectCategory = ({ StaffApp}) => StaffApp.category.item;

export const selectLoading = ({ StaffApp }) => StaffApp.category.loading;
export default categorySlice.reducer;
