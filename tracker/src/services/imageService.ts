import { ResponseType } from "@/types"
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../constants"
import axios from "axios"

const CLOUDINARY_CLOUD_URL =`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`


export const uploadFileToCLoudinary = async(file: {uri?:string} | string, folderName: string): Promise<ResponseType>=>{
  try {

    if (!file) {
      return {success: true,data: null}
    }



    if (typeof file == 'string') {
      return {success: true,data: file}
    }
    if (file && file.uri) {
      const formData = new FormData()
      formData.append("file",{
        uri: file?.uri,
        type: "image/jpeg",
        name: file?.uri?.split("/").pop() || "file.jpg"
      } as any)

      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      formData.append("folder", folderName)

      const response = await axios.post(CLOUDINARY_CLOUD_URL, formData,{
        headers:{
          "Content-Type" :"multipart/form-data"
        }
      })

      console.log('upload image successfull', response?.data)
    return {success: true, data:{ secure_url: response.data.secure_url}}

    }
    return {success: true}
  } catch (error:any) {
    console.log(error)
    return {success: false,msg: error.message}
  }
}