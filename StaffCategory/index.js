
import { combineReducers } from '@reduxjs/toolkit';

import category from './StaffCategorySlice';
import categories from './StaffCategoriesSlice';



const reducer = combineReducers({
category,
categories,


});

export default reducer;
