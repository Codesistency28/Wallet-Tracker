import { ResponseType, WalletType } from "@/types";
import { uploadFileToCLoudinary } from "./imageService";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";


export const createOrUpdate = async (walletData: Partial<WalletType>): Promise<ResponseType> =>{
    try {
        let walletToSave = {...walletData}
        if (walletData?.image && typeof walletData.image !=='string') {
            const imageUplaodRes = await uploadFileToCLoudinary(
                walletData.image,
                "wallets"
            )
            if (!imageUplaodRes.success) {
                return {success: false,
                    msg: imageUplaodRes.msg || "failed to upload wallet icon"
                }       
            }
            walletToSave.image = imageUplaodRes.data?.secure_url
        }

        if (!walletData?.id) {
            walletToSave.amount = 0;
            walletToSave.totalExpenses = 0;
            walletToSave.totalIncome = 0;
            walletToSave.created = new Date();
        }

        const walletRef = walletData?.id ? doc(db, "wallets", walletData.id): doc(collection(db, "wallets"))


        await setDoc(walletRef, walletToSave ,{merge:true})

    return {success: true,data:{...walletToSave , id: walletRef.id} }


    } catch (error:any) {
        // console.log("wallet error: ",error)
    return {success: false,msg: error.message}
    }
}



export const deleteWallet = async(walletId: string ):Promise<ResponseType>=>{
    try {
        const walletRef = doc(db,"wallets", walletId)
        await deleteDoc(walletRef)
        //todo wallet trnsctions
        await deleteTransactionByWallet(walletId)
    return {success: true,msg: "wallet deleted sucessfully" }

    } catch (error:any) {
        // console.log("delete wallet error: ",error)
    return {success: false,msg: error.message}
    }
}


export const deleteTransactionByWallet = async(walletId: string ):Promise<ResponseType>=>{
    try {
        let hasMoreTransaction = true

        while(hasMoreTransaction){
            const transactionQuery = query(
                collection(db, 'transactions'),
                where('walletId', '==', walletId)
            )

            const transactionSnapshot = await  getDocs(transactionQuery)
            if (transactionSnapshot.size == 0) {
                hasMoreTransaction = false
                break
            }

            const batch = writeBatch(db)

            transactionSnapshot.forEach((transactionDoc)=>{
                batch.delete(transactionDoc.ref)
            })
            await batch.commit()

            console.log(`${transactionSnapshot.size}`)
        }
        //todo wallet trnsctions
    return {success: true,msg: "All transaction deleted sucessfully" }

    } catch (error:any) {
        // console.log("delete wallet error: ",error)
    return {success: false,msg: error.message}
    }
}