'use client'
import { useState, useEffect } from "react";
import { get_all_images, delete_image } from "../../../api/image";
import { image, image_type_enum } from "../../../api/api_interfaces";
import Image from "next/image";
import path from "path";
import ImageUpload from "../components/image_upload";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className: string;
}

export default function Images({ className }: props) {

    const [images, set_images] = useState<image[]>([]);
    const [loading, set_loading] = useState<Boolean>(false);
    const [error_message, set_error_message] = useState<string|null>(null);
    const [image_url_for_uploading, set_image_url_for_uploading] = useState<string|null>(null);
    const [category_search, set_category_search] = useState<image_type_enum>(image_type_enum.container);


    const fetch_page_data = async () => {
        set_loading(true)

        await get_all_images(
            (res: image[]) => {
                set_error_message(null)
                set_images(res)
                console.log("image res", res)
            },
            (res: string) => {
                set_images([])
                set_error_message(res)
            },
            category_search
        )
        
        set_loading(false)
    }

    useEffect(()=>{
        fetch_page_data()
    },[category_search])

    const onDelete = (inImg: image) => {
        console.log("deleting ", inImg)
        delete_image(
            inImg,
            () => {
                fetch_page_data()
            },
            (error_message: string)=> {
                set_error_message(error_message)
            }
        )
    }

return (
	<div className={`${className} flex flex-col items-center max-w-prose w-full`}>
        <div className="space-y-4 w-full">
            <ImageUpload category={category_search} image_url={image_url_for_uploading} onImageUpload={(inurl: string|null)=>{
                    set_image_url_for_uploading(null)
                    fetch_page_data()
                }}/>

            <div className="w-full flex justify-between">
                <button className={`px-2 py-1 rounded-lg text-neutral-800 ${category_search==image_type_enum.container ?  "bg-green-400" : "bg-green-400/50 hover:bg-green-500"}`} onClick={()=>{set_category_search(image_type_enum.container)}}>Category Pics</button>
                <button className={`px-2 py-1 rounded-lg text-neutral-800 ${category_search==image_type_enum.in_article ? "bg-green-400" : "bg-green-400/50 hover:bg-green-500"}`} onClick={()=>{set_category_search(image_type_enum.in_article)}}>In Article Pics</button>
            </div>
            {images.map((val: image, index: number) => {
                return(
                    <div key={index} className="bg-neutral-900 rounded-lg px-4 py-2">
                        <p>{val.file_name}</p>
                        <Image
                            className={'h-48 w-auto rounded-lg'} width={300} height={300} alt="" src={path.join(process.env.NEXT_PUBLIC_USER_ACCESS_CMS as string,'images',`${val.file_name}`).toString()}/>
                        <button
                            className="bg-neutral-800 text-neutral-500 hover:bg-red-700 hover:text-red-400 mt-2 rounded-full h-10 w-10 text-center"
                            onClick={()=>{ onDelete(val) }}>X</button>
                    </div>
                )
            })}
        </div>

	</div>
);
}