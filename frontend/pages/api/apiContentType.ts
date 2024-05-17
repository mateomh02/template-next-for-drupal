import axios from 'axios'

export async function getContentType(){
  try{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/content-types-info`)
    const data = response.data
    // console.log(data)
    return data
  }catch(error){
    console.log('This error : '+ error)
  }
}