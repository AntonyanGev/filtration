import { notifyError, notifySuccess } from '@helpers/toast';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import { getCategoryURL, getStuffCategoryURL, orderCategoryURL } from '@api/url';
import { addCategory, removeCategory, updateCategory } from './StaffCategorySlice';

const staffCategoriesAdapter = createEntityAdapter({});

export const { selectAll: selectStaffCategories, selectById: selectCategoryById } =
  staffCategoriesAdapter.getSelectors(({ StaffApp}) => StaffApp.categories);



export const getStaffCategories = createAsyncThunk('categories/get', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getStuffCategoryURL);
    console.log(response.data,"StaffCategoriesSlice GetCAtegories")
  //  const data= await response.data
   return response.data.category
   
    // return data.category;  
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});



const categorySlice = createSlice({
  name: 'categories',
  initialState: staffCategoriesAdapter.getInitialState({
    searchText: '',
    loading: false,
    error: '',
  }),
  reducers: {
    setCategoriesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getStaffCategories.pending]: (state) => {
      state.loading = true;
    },
    [getStaffCategories.fulfilled]: (state, action) => {
      const data = action.payload;
      staffCategoriesAdapter.setAll(state, data);
      state.searchText = '';
      state.error = '';
      state.loading = false;
    },
    [getStaffCategories.rejected]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    
  },
});

export const selectCategoriesSearchText = ({ StaffApp }) => StaffApp.categories.searchText;
export const selectCategoriesLoading = ({ StaffApp}) => StaffApp.categories.loading;

export default categorySlice.reducer;
