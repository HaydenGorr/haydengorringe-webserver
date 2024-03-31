import { useState, useEffect } from "react"
import Image from "next/image";
import Link from "next/link";
export default function MB_Button({ given_href="", text="", image_src="", lowercase=false, btnAction = () => {}, colour="bg-transparent", injected_styles=""}) {

    const [btnText, setBtnText] = useState('');

    useEffect(() => {
        setBtnText(lowercase ? text : text.toUpperCase())
    });

    const handleClick = (event) => {
        if (!given_href) {
            event.preventDefault(); // Prevent navigation if href is empty
        }
        btnAction(); // Call additional action if provided
    };

    const getStyles = () => {
        if (injected_styles) return injected_styles;
        else return `${colour} btn-primary h-10 flex Neo-Brutal-White w-fit active:MB_clicked active:shadow-MB_clicked active:bg-MB_clicked`

    }

    const getParentElement = (child) => {
        if (given_href[0] == '/' ) return <Link onClick={handleClick} className={getStyles()} href={given_href}>{child}</Link>
        else return <a onClick={handleClick} className={getStyles()} href={given_href} target='_blank'>{child}</a>
    }

    return (
        getParentElement(
            < >
                <div className="flex items-center justify-center">
                    {image_src && <Image src={image_src} alt="logo" className="mr-2" width={24} height={24} />}
                    <span className="my-auto leading-none font-medium">{btnText}</span>
                </div>
            </>
        )
    )
}
