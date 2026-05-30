import httpClient from './HttpClient';

// categories API function

export const getCategories = async () => {
  try {
    const response = await httpClient.get('/categories.php');

    return response.data.categories;
  } catch (error) {
    console.log('Categories API Error', error);

    return [];
  }
};

export const getRecipesByCategory = async category => {
  try {
    const response = await httpClient.get(`/filter.php?c=${category}`);

    const formattedData = response.data.meals.map(item => ({
      id: item.idMeal,
      name: item.strMeal,
      image: item.strMealThumb,
    }));
    return formattedData;
  } catch (error) {
    console.log('Recipes By Category API Error', error);
    return [];
  }
};

export const getRecipeDetail = async (id)=>{
  try{
    const response = await httpClient.get(`/lookup.php?i=${id}`)
    const meelData = response?.data?.meals[0];
    return meelData;
  }catch(error){
    console.error("Error feteching detail:", error)
    return
  }
}