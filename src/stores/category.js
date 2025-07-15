import { defineStore } from 'pinia'
import http from '@/utils/http.js'

const initialsCategory = {
  name: '',
}

export const useCategoryStore = defineStore('category', {
  state: () => {
    return {
      categoryInForm: { ...initialsCategory },
      deleteSuccess: false,
      updateSuccess: false,
      createSuccess: false,
      errMessage: '',
      categories: [],
    }
  },
  actions: {
    clearForm() {
      this.categoryInForm = { ...initialsCategory }
    },
    async getCategory(params) {
      const { data } = await http.get('categories', { params })
      this.categories = data.data.rows

      return data.data
    },
    async storeCategory(category) {
      try {
        const res = await http.post('categories', category)
        if (res.data.success) {
          this.getCategory()
        }
      } catch (err) {
        if (err.response.data.message) {
          this.errMessage = err.response.data.message
        }
      }
    },
    async deleteCategoryById(id) {
      http.delete(`categories/${id}`)
    },
    async updateCategory(category) {
      try {
        const res = await http.put(
          `categories/${category.category_id}`,
          category
        )
        if (res.data.success) {
          this.getCategory()
        }
      } catch (err) {
        if (err.response.data.message) {
          this.errMessage = err.response.data.message
        }
      }
    },
    // async updateCategory(category) {
    //   console.log("Hello world" + category.name);
    //   try {
    //     const res = await http.put(`categories/${category.category_id}`, category);
    //     if (res.data.success) {
    //       this.updateSuccess = true;
    //     }
    //   } catch (err) {
    //     return err;
    //   }
    // }
  },
})
